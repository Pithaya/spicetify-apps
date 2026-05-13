import { queryArtistOverview } from '@shared/graphQL/queries/query-artist-overview';
import { searchArtists } from '@shared/graphQL/queries/search-artists';
import { useCallback } from 'react';

export type ArtistItem = {
    id: string;
    uri: string;
    name: string;
    image: string | null;
};

type UseArtistComboboxFetchersReturn = {
    getArtist: (artistUri: string) => Promise<ArtistItem | null>;
    getArtists: (input: string) => Promise<ArtistItem[]>;
    itemToString: (item: ArtistItem) => string;
};

export function useArtistComboboxFetchers(
    onNotFound: () => void,
): UseArtistComboboxFetchersReturn {
    const getArtists = useCallback(
        async (input: string): Promise<ArtistItem[]> => {
            if (!input.trim()) {
                return [];
            }

            const search = await searchArtists({
                searchTerm: input,
                offset: 0,
                limit: 10,
                numberOfTopResults: 0,
                includeAudiobooks: true,
                includeAuthors: true,
                includeEpisodeContentRatingsV2: true,
                includePreReleases: true,
            });

            const items: ArtistItem[] = search.searchV2.artists.items.map(
                (artist) => ({
                    id: artist.data.uri,
                    uri: artist.data.uri,
                    name: artist.data.profile.name,
                    image:
                        artist.data.visuals.avatarImage?.sources &&
                        artist.data.visuals.avatarImage.sources.length > 0
                            ? artist.data.visuals.avatarImage.sources[0].url
                            : null,
                }),
            );

            return items;
        },
        [],
    );

    const getArtist = useCallback(
        async (artistUri: string): Promise<ArtistItem | null> => {
            try {
                const artist = await queryArtistOverview({
                    uri: artistUri,
                });

                if (artist.artistUnion.__typename === 'NotFound') {
                    throw new Error('Artist not found');
                }

                const artistItem: ArtistItem = {
                    id: artist.artistUnion.uri,
                    name: artist.artistUnion.profile.name,
                    uri: artist.artistUnion.uri,
                    image:
                        artist.artistUnion.visuals.avatarImage.sources.length >
                        0
                            ? artist.artistUnion.visuals.avatarImage.sources[0]
                                  .url
                            : null,
                };

                return artistItem;
            } catch (e) {
                console.error('Failed to fetch artist', e);
                onNotFound();

                return null;
            }
        },
        [onNotFound],
    );

    const itemToString = useCallback(
        (item: ArtistItem): string => item.name,
        [],
    );

    return { getArtist, getArtists, itemToString };
}
