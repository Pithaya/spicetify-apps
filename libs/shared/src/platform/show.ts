import type { Image } from './shared';

export type ShowMetadata = {
    type: 'show';
    uri: string;
    name: string;
    description: string;
    htmlDescription: string;
    coverArt: Image[];
    trailer: {
        type: 'episode';
        uri: string;
        name: string;
        coverArt: Image[];
        audio: {
            items: unknown[];
        };
        audioPreview: unknown;
        sharingInfo: unknown;
        duration: {
            milliseconds: number;
        };
        contentRating: {
            label: string;
        };
    };
    topics: {
        uri: string;
        title: string;
    }[];
    podcastType: string;
    showTypes: unknown[];
    publisherName: string;
    consumptionOrder: string;
    nextBestEpisode: {
        type: string;
        data: {
            type: 'episode';
            uri: string;
            name: string;
            description: string;
            htmlDescription: string;
            episodeType: string;
            coverArt: Image[];
            playedState: {
                playPositionMilliseconds: number;
                playPosition: number;
                state: string;
            };
            mediaTypes: string[];
            audio: {
                items: unknown[];
            };
            audioPreview: unknown;
            sharingInfo: unknown;
            segmentsCount: number;
            podcast: unknown;
            podcastSubscription: {
                isPaywalled: boolean;
                isUserSubscribed: boolean;
            };
            releaseDate: {
                isoString: string;
            };
            playability: {
                playable: boolean;
                reason: string;
            };
            contentRating: {
                label: string;
            };
            duration: {
                milliseconds: number;
            };
            contentInformation: unknown;
            transcripts: {
                uri: string;
                language: string;
                curated: boolean;
                cdnUrl: string;
            }[];
        };
    };
    gatedContentAccessReason: unknown;
};

export type ShowAPI = {
    getMetadata: (uri: string) => Promise<ShowMetadata>;
};
