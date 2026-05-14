import { getRootlistPlaylists } from '@shared/utils/rootlist-utils';
import { getPlatform } from '@shared/utils/spicetify-utils';
import { useCallback } from 'react';

export type PlaylistItem = {
    id: string;
    uri: string;
    name: string;
    image: string | null;
    ownerName: string;
};

type UseLibraryPlaylistComboboxFetchersReturn = {
    getPlaylist: (playlistUri: string) => Promise<PlaylistItem | null>;
    getPlaylists: (input: string) => Promise<PlaylistItem[]>;
    itemToString: (item: PlaylistItem) => string;
};

export function useLibraryPlaylistComboboxFetchers(
    onlyMyPlaylists: boolean,
    onNotFound: () => void,
): UseLibraryPlaylistComboboxFetchersReturn {
    const getPlaylists = useCallback(
        async (input: string): Promise<PlaylistItem[]> => {
            const userAPI = getPlatform().UserAPI;
            const user = await userAPI.getUser();

            let playlists = await getRootlistPlaylists(input);

            playlists = playlists.filter((p) => p.name !== '');

            if (onlyMyPlaylists) {
                playlists = playlists.filter((p) => p.owner.uri === user.uri);
            }

            playlists = playlists.toSorted((a, b) =>
                a.name.localeCompare(b.name),
            );

            const items = playlists.map((p) => ({
                id: p.uri,
                name: p.name,
                uri: p.uri,
                image:
                    p.images.length > 0
                        ? (p.images.find((i) => i.label === 'small')?.url ??
                          p.images[0].url)
                        : null,
                ownerName: p.owner.displayName,
            }));

            return items;
        },
        [onlyMyPlaylists],
    );

    const getPlaylist = useCallback(
        async (playlistUri: string): Promise<PlaylistItem | null> => {
            const playlistApi = getPlatform().PlaylistAPI;

            try {
                const playlist = await playlistApi.getPlaylist(
                    playlistUri,
                    {},
                    {},
                );

                const playlistItem: PlaylistItem = {
                    id: playlist.metadata.uri,
                    name: playlist.metadata.name,
                    uri: playlist.metadata.uri,
                    image:
                        playlist.metadata.images.length > 0
                            ? playlist.metadata.images[0].url
                            : null,
                    ownerName: playlist.metadata.owner.displayName,
                };

                return playlistItem;
            } catch (e) {
                console.error('Failed to fetch playlist', e);
                onNotFound();

                return null;
            }
        },
        [onNotFound],
    );

    const itemToString = useCallback(
        (item: PlaylistItem): string => item.name,
        [],
    );

    return { getPlaylists, getPlaylist, itemToString };
}
