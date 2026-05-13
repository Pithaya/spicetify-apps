import {
    fetchPlaylistMetadata,
    type Playlist,
} from '@shared/graphQL/queries/fetch-playlist-metadata';
import { getAlbum, type Album } from '@shared/graphQL/queries/get-album';
import { getAlbumNameAndTracks } from '@shared/graphQL/queries/get-album-name-and-tracks';
import { getEpisodeName } from '@shared/graphQL/queries/get-episode-name';
import {
    getEpisodeOrChapter,
    type Chapter,
    type Episode,
} from '@shared/graphQL/queries/get-episode-or-chapter';
import { getPodcastOrBookName } from '@shared/graphQL/queries/get-podcast-or-book-name';
import { getTrack, type Track } from '@shared/graphQL/queries/get-track';
import { getTrackName } from '@shared/graphQL/queries/get-track-name';
import { queryArtistMinimal } from '@shared/graphQL/queries/query-artist-minimal';
import {
    queryArtistOverview,
    type Artist,
} from '@shared/graphQL/queries/query-artist-overview';
import {
    queryShowMetadataV2,
    type Podcast,
} from '@shared/graphQL/queries/query-show-metadata-v2';
import type { NotFound } from '@shared/graphQL/types/shared/not-found';
import { isNotEmpty } from '@shared/utils/array-utils';

export type DataItem =
    | Track
    | Album
    | Artist
    | Playlist
    | Podcast
    | Episode
    | Chapter;

export async function getDataForUris(
    uris: string[],
): Promise<(DataItem | NotFound)[]> {
    if (!isNotEmpty(uris)) {
        return [];
    }

    if (uris.every((uri) => Spicetify.URI.isTrack(uri))) {
        const trackData = await Promise.all(
            uris.map(async (uri) => await getTrack({ uri })),
        );

        return trackData.map((data) => data.trackUnion);
    }

    if (uris.every((uri) => Spicetify.URI.isAlbum(uri))) {
        const albumData = await Promise.all(
            uris.map(
                async (uri) => await getAlbum({ uri, offset: 0, limit: 0 }),
            ),
        );

        return albumData.map((data) => data.albumUnion);
    }

    if (uris.every((uri) => Spicetify.URI.isArtist(uri))) {
        const artistOverviews = await Promise.all(
            uris.map(async (uri) => await queryArtistOverview({ uri })),
        );

        return artistOverviews.map((data) => data.artistUnion);
    }

    if (uris.every((uri) => Spicetify.URI.isPlaylistV1OrV2(uri))) {
        const playlists = await Promise.all(
            uris.map(
                async (uri) =>
                    await fetchPlaylistMetadata({
                        uri,
                        enableWatchFeedEntrypoint: true,
                    }),
            ),
        );

        return playlists.map((data) => data.playlistV2);
    }

    if (uris.every((uri) => Spicetify.URI.isShow(uri))) {
        const showData = await Promise.all(
            uris.map(async (uri) => await queryShowMetadataV2({ uri })),
        );

        return showData.map((data) => data.podcastUnionV2);
    }

    if (uris.every((uri) => Spicetify.URI.isEpisode(uri))) {
        const episodeData = await Promise.all(
            uris.map(async (uri) => await getEpisodeOrChapter({ uri })),
        );

        return episodeData.map((data) => data.episodeUnionV2);
    }

    return [];
}

export async function getNameForUris(
    uris: string[],
): Promise<(string | null)[]> {
    if (!isNotEmpty(uris)) {
        return [];
    }

    if (uris.every((uri) => Spicetify.URI.isTrack(uri))) {
        const trackData = await Promise.all(
            uris.map(async (uri) => await getTrackName({ uri })),
        );

        return trackData.map((data) =>
            data.trackUnion.__typename === 'Track'
                ? data.trackUnion.name
                : null,
        );
    }

    if (uris.every((uri) => Spicetify.URI.isAlbum(uri))) {
        const albumData = await Promise.all(
            uris.map(
                async (uri) =>
                    await getAlbumNameAndTracks({ uri, offset: 0, limit: 0 }),
            ),
        );

        return albumData.map((data) =>
            data.albumUnion.__typename === 'Album'
                ? data.albumUnion.name
                : null,
        );
    }

    if (uris.every((uri) => Spicetify.URI.isArtist(uri))) {
        const artistOverviews = await Promise.all(
            uris.map(
                async (uri) =>
                    await queryArtistMinimal({ uri, offset: 0, limit: 0 }),
            ),
        );

        return artistOverviews.map((data) =>
            data.artistUnion.__typename === 'Artist'
                ? data.artistUnion.profile.name
                : null,
        );
    }

    if (uris.every((uri) => Spicetify.URI.isPlaylistV1OrV2(uri))) {
        const playlists = await Promise.all(
            uris.map(
                async (uri) =>
                    await fetchPlaylistMetadata({
                        uri,
                        enableWatchFeedEntrypoint: true,
                    }),
            ),
        );

        return playlists.map((data) =>
            data.playlistV2.__typename === 'Playlist'
                ? data.playlistV2.name
                : null,
        );
    }

    if (uris.every((uri) => Spicetify.URI.isShow(uri))) {
        const showData = await Promise.all(
            uris.map(async (uri) => await getPodcastOrBookName({ uri })),
        );

        return showData.map((data) =>
            data.podcastUnionV2.__typename !== 'NotFound'
                ? data.podcastUnionV2.name
                : null,
        );
    }

    if (uris.every((uri) => Spicetify.URI.isEpisode(uri))) {
        const episodeData = await Promise.all(
            uris.map(async (uri) => await getEpisodeName({ uri })),
        );

        return episodeData.map((data) =>
            data.episodeUnionV2.__typename === 'Episode'
                ? data.episodeUnionV2.name
                : null,
        );
    }

    return [];
}
