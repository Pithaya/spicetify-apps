import { PLATFORM_API_MAX_LIMIT } from '@shared/platform/constants';
import {
    type LibraryAPITrack,
    LibraryAPITrackSortOptionFields,
    LibraryAPITrackSortOptionOrders,
} from '@shared/platform/library';
import { getPlatform } from '@shared/utils/spicetify-utils';
import { mapLibraryAPITrackToWorkflowTrack } from 'custom-apps/playlist-maker/src/utils/mapping-utils';
import { getArtistsGenresCache } from 'custom-apps/playlist-maker/src/utils/storage-utils';
import { z } from 'zod';
import { type WorkflowTrack } from '../../workflow-track';
import { BaseNodeDataSchema, NodeProcessor } from '../node-processor';

export const LikedSongsDataSchema = z
    .object({
        offset: z.number().nonnegative().int().optional(),
        limit: z
            .number()
            .nonnegative()
            .int()
            .max(PLATFORM_API_MAX_LIMIT)
            .optional(),
        filter: z.string().optional(),
        sortField: z.enum(LibraryAPITrackSortOptionFields),
        sortOrder: z.enum(LibraryAPITrackSortOptionOrders),
        genres: z.array(z.string()),
    })
    .merge(BaseNodeDataSchema)
    .strict();

export type LikedSongsData = z.infer<typeof LikedSongsDataSchema>;

/**
 * Source node that returns liked songs.
 */
export class LikedSongsSourceProcessor extends NodeProcessor<LikedSongsData> {
    protected override async getResultsInternal(): Promise<WorkflowTrack[]> {
        const libraryApi = getPlatform().LibraryAPI;

        const { offset, filter, sortField, sortOrder, genres } = this.data;
        let limit = this.data.limit;

        if (limit === undefined || genres.length > 0) {
            // If no limit, make a first call to get the total number of liked songs.
            // Also get all when we have genres as we will apply the limit after filtering.
            limit = (await libraryApi.getTracks()).unfilteredTotalLength;
        }

        const apiResult = await libraryApi.getTracks({
            limit,
            offset,
            filters: filter ? [filter] : undefined,
            sort: {
                field: sortField,
                order: sortOrder,
            },
        });

        let tracks = apiResult.items;

        if (genres.length > 0) {
            tracks = this.filterTracksByGenres(
                tracks,
                new Set(genres),
                this.data.limit,
            );
        }

        return tracks.map((track) =>
            mapLibraryAPITrackToWorkflowTrack(track, { source: 'Liked songs' }),
        );
    }

    private filterTracksByGenres(
        tracks: LibraryAPITrack[],
        genres: Set<string>,
        limit: number | undefined,
    ): LibraryAPITrack[] {
        const result = [];

        // Don't keep local tracks as we can't get genres from them
        const libraryTracks = tracks.filter(
            (track) => !Spicetify.URI.isLocalTrack(track.uri),
        );

        const artistGenres = getArtistsGenresCache();

        for (const track of libraryTracks) {
            const trackGenres = track.artists.flatMap(
                (artist) => artistGenres.get(artist.uri)?.value ?? [],
            );

            if (trackGenres.some((trackGenre) => genres.has(trackGenre))) {
                result.push(track);
            }
        }

        return limit !== undefined ? result.slice(0, limit) : result;
    }
}
