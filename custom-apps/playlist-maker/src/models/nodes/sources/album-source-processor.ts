import { GRAPHQL_MAX_LIMIT } from '@shared/graphQL/constants';
import { getAlbum, type GetAlbumData } from '@shared/graphQL/queries/get-album';
import { mapGraphQLTrackToWorkflowTrack } from 'custom-apps/playlist-maker/src/utils/mapping-utils';
import { z } from 'zod';
import { type WorkflowTrack } from '../../workflow-track';
import { BaseNodeDataSchema, NodeProcessor } from '../node-processor';

export const AlbumDataSchema = z
    .object({
        uri: z
            .string()
            .nonempty({ message: 'Album URI is required' })
            .refine((value) => Spicetify.URI.isAlbum(value), {
                message: 'Invalid album URI',
            }),
        offset: z.number().nonnegative().int().optional(),
        limit: z.number().nonnegative().int().max(GRAPHQL_MAX_LIMIT).optional(),
        onlyLiked: z.boolean(),
    })
    .merge(BaseNodeDataSchema)
    .strict();

export type AlbumData = z.infer<typeof AlbumDataSchema>;

/**
 * Source node that returns tracks from an album.
 */
export class AlbumSourceProcessor extends NodeProcessor<AlbumData> {
    protected override async getResultsInternal(): Promise<WorkflowTrack[]> {
        const {
            offset = 0,
            limit = GRAPHQL_MAX_LIMIT,
            uri,
            onlyLiked,
        } = this.data;

        const album: GetAlbumData = await getAlbum({
            uri,
            offset,
            limit,
            locale: Spicetify.Locale.getLocale(),
        });

        let tracks = album.albumUnion.tracksV2.items.map((item) => item.track);

        if (onlyLiked) {
            tracks = tracks.filter((track) => track.saved);
        }

        const mappedTracks: WorkflowTrack[] = tracks.map((track) =>
            mapGraphQLTrackToWorkflowTrack(track, album.albumUnion, {
                source: 'Album',
                albumData: {
                    releaseDate: new Date(album.albumUnion.date.isoString),
                },
            }),
        );

        return mappedTracks;
    }
}
