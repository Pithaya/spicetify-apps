import { type SimpleTrack } from '@shared/components/track-list/models/interfaces';
import { GRAPHQL_MAX_LIMIT } from '@shared/graphQL/constants';
import { getAlbumNameAndTracks } from '@shared/graphQL/queries/get-album-name-and-tracks';
import { queryAlbumTracks } from '@shared/graphQL/queries/query-album-tracks';
import {
    queryArtistOverview,
    type QueryArtistOverviewData,
    type Release,
    type TopTrack,
} from '@shared/graphQL/queries/query-artist-overview';
import { PLATFORM_API_MAX_LIMIT } from '@shared/platform/constants';
import type { LibraryAPI, LibraryAPITrack } from '@shared/platform/library';
import { getPlatformApiOrThrow } from '@shared/utils/spicetify-utils';
import { z } from 'zod';
import { type WorkflowTrack } from '../../track';
import { BaseNodeDataSchema, NodeProcessor } from '../node-processor';

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

    private async getLikedTracks(uri: string): Promise<WorkflowTrack[]> {
        const libraryApi = getPlatformApiOrThrow<LibraryAPI>('LibraryAPI');

        const tracks: LibraryAPITrack[] = (
            await libraryApi.getTracks({
                limit: PLATFORM_API_MAX_LIMIT,
                offset: 0,
                uri,
            })
        ).items;

        return tracks.map((track) => ({
            ...track,
            source: 'Artist',
        }));
    }

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
        const topTracksAlbums = new Map<string, string>();
        const mappedTopTracks = [];

        // Top tracks should be from one of the artist's albums
        for (const release of this.getAllReleasesFromOverview(artistOverview)) {
            topTracksAlbums.set(release.uri, release.name);
        }

        for (const topTrack of topTracks) {
            const albumUri = topTrack.track.albumOfTrack.uri;
            let albumName = '';

            if (!topTracksAlbums.has(albumUri)) {
                const album = await getAlbumNameAndTracks({
                    uri: albumUri,
                    limit: 0,
                    offset: 0,
                });

                topTracksAlbums.set(albumUri, album.albumUnion.name);
            }

            albumName = topTracksAlbums.get(albumUri)!;

            mappedTopTracks.push(
                this.getTrackFromTopTrack(topTrack, albumName),
            );
        }

        return [...mappedTopTracks, ...popularReleasesTracks];
    }

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
            // Need to filter out songs in the compilation where the artist is not the main artist
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

    private async getTracksFromRelease(
        release: Release,
    ): Promise<WorkflowTrack[]> {
        const releaseUri = release.uri;
        const data = await queryAlbumTracks({
            uri: releaseUri,
            offset: 0,
            limit: GRAPHQL_MAX_LIMIT,
        });

        const tracks: SimpleTrack[] = data.albumUnion.tracksV2.items.map(
            (track) => ({
                uri: track.track.uri,
                name: track.track.name,
                album: {
                    uri: release.uri,
                    name: release.name,
                    images: release.coverArt.sources,
                },
                artists: track.track.artists.items.map((artist) => ({
                    uri: artist.uri,
                    name: artist.profile.name,
                })),
                duration: {
                    milliseconds: track.track.duration.totalMilliseconds,
                },
                isPlayable: track.track.playability.playable,
                trackNumber: track.track.trackNumber,
                addedAt: undefined,
            }),
        );

        return tracks.map((track) => ({
            ...track,
            source: 'Artist',
        }));
    }

    private getTrackFromTopTrack(
        track: TopTrack,
        albumName: string,
    ): WorkflowTrack {
        const mappedTrack: SimpleTrack = {
            uri: track.track.uri,
            name: track.track.name,
            album: {
                uri: track.track.albumOfTrack.uri,
                name: albumName,
                images: track.track.albumOfTrack.coverArt.sources.map(
                    (source) => ({ url: source.url }),
                ),
            },
            artists: track.track.artists.items.map((artist) => ({
                uri: artist.uri,
                name: artist.profile.name,
            })),
            duration: {
                milliseconds: track.track.duration.totalMilliseconds,
            },
            isPlayable: track.track.playability.playable,
            trackNumber: 0,
            addedAt: undefined,
        };

        return {
            ...mappedTrack,
            source: 'Artist',
        };
    }

    private getAllReleasesFromOverview(
        overview: QueryArtistOverviewData,
    ): Release[] {
        const releases = [];

        releases.push(
            ...overview.artistUnion.discography.albums.items
                .map((i) => i.releases.items)
                .flat(),
        );
        releases.push(
            ...overview.artistUnion.discography.compilations.items
                .map((i) => i.releases.items)
                .flat(),
        );
        releases.push(
            ...overview.artistUnion.discography.singles.items
                .map((i) => i.releases.items)
                .flat(),
        );

        return releases;
    }
}
