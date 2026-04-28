import { searchSuggestions } from '@shared/graphQL/queries/search-suggestions';
import { getPlatform } from '@shared/utils/spicetify-utils';
import { useCallback } from 'react';

export type PlaylistItem = {
    id: string;
    uri: string;
    name: string;
    image: string | null;
    ownerName: string;
};

type UsePlaylistComboboxFetchersReturn = {
    getPlaylist: (playlistUri: string) => Promise<PlaylistItem | null>;
    getPlaylists: (input: string) => Promise<PlaylistItem[]>;
    itemToString: (item: PlaylistItem) => string;
};

export function usePlaylistComboboxFetchers(
    onNotFound: () => void,
): UsePlaylistComboboxFetchersReturn {
    const getPlaylists = useCallback(
        async (input: string): Promise<PlaylistItem[]> => {
            if (!input.trim()) {
                return [];
            }

            // TODO: searchPlaylists
            const search = await searchSuggestions({
                query: input,
                offset: 0,
                limit: 20,
                numberOfTopResults: 5,
                includeAuthors: true,
                includeEpisodeContentRatingsV2: true,
            });

            const items: PlaylistItem[] = search.searchV2.topResultsV2.itemsV2
                .map((item) => item.item)
                .filter((item) => item.__typename === 'PlaylistResponseWrapper')
                .map((playlistWrapper) => playlistWrapper.data)
                .map((playlist) => ({
                    id: playlist.uri,
                    uri: playlist.uri,
                    name: playlist.name,
                    image: playlist.images.items[0]?.sources[0].url ?? null,
                    ownerName: playlist.ownerV2.data.name,
                }));

            return items;
        },
        [],
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
