import { GRAPHQL_MAX_LIMIT } from '@shared/graphQL/constants';
import { getAlbum, type GetAlbumData } from '@shared/graphQL/queries/get-album';
import { queryAlbumTracks } from '@shared/graphQL/queries/query-album-tracks';
import {
    queryArtistOverview,
    type Release,
} from '@shared/graphQL/queries/query-artist-overview';
import { PLATFORM_API_MAX_LIMIT } from '@shared/platform/constants';
import type { LibraryAPITrack } from '@shared/platform/library';
import { getPlatform } from '@shared/utils/spicetify-utils';
import {
    mapGraphQLTrackToWorkflowTrack,
    mapInternalTrackToWorkflowTrack,
} from 'custom-apps/playlist-maker/src/utils/mapping-utils';
import { z } from 'zod';
import { type WorkflowTrack } from '../../workflow-track';
import { BaseNodeDataSchema } from '../base-node-processor';
import { NodeProcessor } from '../node-processor';

const ArtistTrackTypeList = ['liked', 'top', 'discography', 'latest'] as const;
export type ArtistTrackType = (typeof ArtistTrackTypeList)[number];

export const ArtistDataSchema = z
    .object({
        uri: z
            .string()
            .nonempty({ message: 'Artist URI is required' })
            .refine((value) => Spicetify.URI.isArtist(value), {
                message: 'Invalid artist URI',
            }),
        trackType: z.enum(ArtistTrackTypeList),
    })
    .merge(BaseNodeDataSchema)
    .strict();

export type ArtistData = z.infer<typeof ArtistDataSchema>;

/**
 * Source node that returns tracks from an artist.
 */
export class ArtistTracksSourceProcessor extends NodeProcessor<ArtistData> {
    protected override async getResultsInternal(): Promise<WorkflowTrack[]> {
        const { uri, trackType } = this.data;

        if (trackType === 'liked') {
            return await this.getLikedTracks(uri);
        } else if (trackType === 'top') {
            return await this.getTopTracks(uri);
        } else if (trackType === 'latest') {
            return await this.getLatestReleaseTracks(uri);
        } else {
            return await this.getAllTracks(uri);
        }
    }

    /**
     * Get liked tracks for the artist from the library API.
     * @param uri The artist URI.
     * @returns The tracks.
     */
    private async getLikedTracks(uri: string): Promise<WorkflowTrack[]> {
        const libraryApi = getPlatform().LibraryAPI;

        const tracks: LibraryAPITrack[] = (
            await libraryApi.getTracks({
                limit: PLATFORM_API_MAX_LIMIT,
                offset: 0,
                uri,
            })
        ).items;

        return tracks.map((track) =>
            mapInternalTrackToWorkflowTrack(track, { source: 'Artist' }),
        );
    }

    /**
     * Get tracks from the artist's top tracks and popular releases.
     * @param uri The artist URI.
     * @returns The tracks.
     */
    private async getTopTracks(uri: string): Promise<WorkflowTrack[]> {
        const artistOverview = await queryArtistOverview({
            uri,
            locale: Spicetify.Locale.getLocale(),
        });

        // Get popular releases
        const popularReleases =
            artistOverview.artistUnion.discography.popularReleasesAlbums.items;
        const popularReleasesTracks = [];

        for (const popularRelease of popularReleases) {
            popularReleasesTracks.push(
                ...(await this.getTracksFromRelease(popularRelease)),
            );
        }

        // Get top tracks
        const topTracks =
            artistOverview.artistUnion.discography.topTracks.items;
        const topTracksAlbums = new Map<string, GetAlbumData>();
        const mappedTopTracks = [];

        // Get top tracks saved status
        const libraryApi = getPlatform().LibraryAPI;
        const saved: boolean[] = await libraryApi.contains(
            ...topTracks.map((track) => track.track.uri),
        );

        for (const [index, topTrack] of topTracks.entries()) {
            // Get the album of the track to get the album name
            const albumUri = topTrack.track.albumOfTrack.uri;

            if (!topTracksAlbums.has(albumUri)) {
                const album = await getAlbum({
                    uri: albumUri,
                    limit: 0,
                    offset: 0,
                    locale: Spicetify.Locale.getLocale(),
                });

                topTracksAlbums.set(albumUri, album);
            }

            const trackAlbum = topTracksAlbums.get(albumUri)!;

            mappedTopTracks.push(
                mapGraphQLTrackToWorkflowTrack(
                    {
                        ...topTrack.track,
                        saved: saved[index] ?? false,
                    },
                    {
                        uri: albumUri,
                        name: trackAlbum.albumUnion.name,
                        coverArt: topTrack.track.albumOfTrack.coverArt,
                    },
                    {
                        source: 'Artist',
                        albumData: {
                            releaseDate: new Date(
                                trackAlbum.albumUnion.date.isoString,
                            ),
                        },
                    },
                ),
            );
        }

        return [...mappedTopTracks, ...popularReleasesTracks];
    }

    /**
     * Get the tracks for the latest release of the artist.
     * @param uri The artist URI.
     * @returns The tracks.
     */
    private async getLatestReleaseTracks(
        uri: string,
    ): Promise<WorkflowTrack[]> {
        const artistOverview = await queryArtistOverview({
            uri,
            locale: Spicetify.Locale.getLocale(),
        });

        const latestRelease = artistOverview.artistUnion.discography.latest;
        return await this.getTracksFromRelease(latestRelease);
    }

    /**
     * Get all tracks from the artist's discography.
     * This includes albums, compilations, and singles.
     * @param uri The artist URI.
     * @returns The tracks.
     */
    private async getAllTracks(uri: string): Promise<WorkflowTrack[]> {
        const artistOverview = await queryArtistOverview({
            uri,
            locale: Spicetify.Locale.getLocale(),
        });

        // Get artist albums
        const albums = artistOverview.artistUnion.discography.albums.items
            .map((i) => i.releases.items)
            .flat();
        const albumTracks = [];

        for (const album of albums) {
            albumTracks.push(...(await this.getTracksFromRelease(album)));
        }

        // Get artist compilations
        const compilations =
            artistOverview.artistUnion.discography.compilations.items
                .map((i) => i.releases.items)
                .flat();
        const compilationTracks = [];

        for (const compilation of compilations) {
            const tracks = await this.getTracksFromRelease(compilation);
            // Need to filter out songs in the compilation where the artist is not present
            compilationTracks.push(
                ...tracks.filter((track) =>
                    track.artists.some((artist) => artist.uri === uri),
                ),
            );
        }

        // Get artist singles
        const singles = artistOverview.artistUnion.discography.singles.items
            .map((i) => i.releases.items)
            .flat();
        const singleTracks = [];

        for (const single of singles) {
            singleTracks.push(...(await this.getTracksFromRelease(single)));
        }

        return [...albumTracks, ...compilationTracks, ...singleTracks];
    }

    /**
     * Get the tracks from a release (album).
     * @param release The release to get the tracks from.
     * @returns The tracks.
     */
    private async getTracksFromRelease(
        release: Release,
    ): Promise<WorkflowTrack[]> {
        const releaseUri = release.uri;
        const data = await queryAlbumTracks({
            uri: releaseUri,
            offset: 0,
            limit: GRAPHQL_MAX_LIMIT,
        });

        return data.albumUnion.tracksV2.items.map((item) =>
            mapGraphQLTrackToWorkflowTrack(item.track, release, {
                source: 'Artist',
                albumData: {
                    releaseDate: new Date(
                        release.date.year,
                        release.date.month,
                        release.date.day,
                    ),
                },
            }),
        );
    }
}
