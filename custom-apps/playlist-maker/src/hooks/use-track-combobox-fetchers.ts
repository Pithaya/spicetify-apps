import { getTrack as getGraphQlTrack } from '@shared/graphQL/queries/get-track';
import { searchTracks } from '@shared/graphQL/queries/search-tracks';
import { useCallback } from 'react';

export type TrackItem = {
    id: string;
    uri: string;
    name: string;
    image: string | null;
    album: string;
    artists: string;
};

type UseTrackComboboxFetchersReturn = {
    getTrack: (trackUri: string) => Promise<TrackItem | null>;
    getTracks: (input: string) => Promise<TrackItem[]>;
    itemToString: (item: TrackItem) => string;
};

export function useTrackComboboxFetchers(
    onNotFound: () => void,
): UseTrackComboboxFetchersReturn {
    const getTracks = useCallback(
        async (input: string): Promise<TrackItem[]> => {
            if (!input.trim()) {
                return [];
            }

            const search = await searchTracks({
                searchTerm: input,
                offset: 0,
                limit: 10,
                numberOfTopResults: 0,
                includeAuthors: true,
                includeEpisodeContentRatingsV2: true,
                includeAudiobooks: true,
                includePreReleases: true,
            });

            const items: TrackItem[] = search.searchV2.tracksV2.items
                .map((track) => track.item.data)
                .filter((track) => track.__typename === 'Track')
                .map((track) => {
                    return {
                        id: track.uri,
                        uri: track.uri,
                        name: track.name,
                        image:
                            track.albumOfTrack.coverArt.sources.length > 0
                                ? track.albumOfTrack.coverArt.sources[0].url
                                : null,
                        artists: track.artists.items
                            .map((artist) => artist.profile.name)
                            .join(', '),
                        album: track.albumOfTrack.name,
                    };
                });

            return items;
        },
        [],
    );

    const getTrack = useCallback(
        async (trackUri: string): Promise<TrackItem | null> => {
            try {
                const trackResponse = await getGraphQlTrack({
                    uri: trackUri,
                });

                if (trackResponse.trackUnion.__typename === 'NotFound') {
                    throw new Error('Track not found');
                }

                const track = trackResponse.trackUnion;
                const trackArtists = [
                    ...track.firstArtist.items,
                    ...track.otherArtists.items,
                ];

                const trackItem: TrackItem = {
                    id: track.uri,
                    name: track.name,
                    uri: track.uri,
                    image:
                        track.albumOfTrack.coverArt.sources.length > 0
                            ? track.albumOfTrack.coverArt.sources[0].url
                            : null,
                    artists: trackArtists
                        .map((artist) => artist.profile.name)
                        .join(', '),
                    album: track.albumOfTrack.name,
                };

                return trackItem;
            } catch (e) {
                console.error('Failed to fetch track', e);
                onNotFound();

                return null;
            }
        },
        [onNotFound],
    );

    const itemToString = useCallback(
        (item: TrackItem): string => item.name,
        [],
    );

    return { getTrack, getTracks, itemToString };
}
