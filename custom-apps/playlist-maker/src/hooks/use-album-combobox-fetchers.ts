import { getAlbum as getGraphQlAlbum } from '@shared/graphQL/queries/get-album';
import { searchSuggestions } from '@shared/graphQL/queries/search-suggestions';
import { useCallback } from 'react';

export type AlbumItem = {
    id: string;
    uri: string;
    name: string;
    image: string | null;
    artists: string;
};

type UseAlbumComboboxFetchersReturn = {
    getAlbum: (albumUri: string) => Promise<AlbumItem | null>;
    getAlbums: (input: string) => Promise<AlbumItem[]>;
    itemToString: (item: AlbumItem) => string;
};

export function useAlbumComboboxFetchers(
    onNotFound: () => void,
): UseAlbumComboboxFetchersReturn {
    const getAlbums = useCallback(
        async (input: string): Promise<AlbumItem[]> => {
            if (!input.trim()) {
                return [];
            }

            const search = await searchSuggestions({
                query: input,
                offset: 0,
                limit: 10,
                numberOfTopResults: 5,
                includeAuthors: true,
                includeEpisodeContentRatingsV2: true,
            });

            const items: AlbumItem[] = search.searchV2.topResultsV2.itemsV2
                .map((item) => item.item)
                .filter((item) => item.__typename === 'AlbumResponseWrapper')
                .map((album) => {
                    return {
                        id: album.data.uri,
                        uri: album.data.uri,
                        name: album.data.name,
                        image:
                            album.data.coverArt.sources.length > 0
                                ? album.data.coverArt.sources[0].url
                                : null,
                        artists: album.data.artists.items
                            .map((artist) => artist.profile.name)
                            .join(', '),
                    };
                });

            return items;
        },
        [],
    );

    const getAlbum = useCallback(
        async (albumUri: string): Promise<AlbumItem | null> => {
            try {
                const album = await getGraphQlAlbum({
                    uri: albumUri,
                    offset: 0,
                    limit: 0,
                    locale: Spicetify.Locale.getLocale(),
                });

                if (album.albumUnion.__typename === 'NotFound') {
                    throw new Error('Album not found');
                }

                const albumItem: AlbumItem = {
                    id: album.albumUnion.uri,
                    name: album.albumUnion.name,
                    uri: album.albumUnion.uri,
                    image:
                        album.albumUnion.coverArt.sources.length > 0
                            ? album.albumUnion.coverArt.sources[0].url
                            : null,
                    artists: album.albumUnion.artists.items
                        .map((artist) => artist.profile.name)
                        .join(', '),
                };

                return albumItem;
            } catch (e) {
                console.error('Failed to fetch album', e);
                onNotFound();

                return null;
            }
        },
        [onNotFound],
    );

    const itemToString = useCallback(
        (item: AlbumItem): string => item.name,
        [],
    );

    return { getAlbums, getAlbum, itemToString };
}
