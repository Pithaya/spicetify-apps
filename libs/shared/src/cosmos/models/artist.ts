import { Cover } from './cover';
import { Release } from './release';

export type Artist = {
    biography: {
        text: string;
    };

    creator_about: {
        monthlyListeners: number;
    };

    gallery: {};

    header_image: {
        image: string;
        offset: number;
    };

    info: {
        name: string;
        portraits: {
            uri: string;
        }[];
        uri: string;
        verified: boolean;
    };

    latest_release: Release;

    merch: {
        items: {
            description: string;
            image_uri: string;
            link: string;
            name: string;
            price: string;
            uuid: string;
        }[];
    };

    monthly_listeners: {
        listener_count: number;
    };

    published_playlists: {
        playlists: {
            cover: Cover;
            follower_count: number;
            name: string;
            uri: string;
        }[];
    };

    related_artists: {
        artists: {
            name: string;
            portraits: {
                uri: string;
            }[];
            uri: string;
        }[];
    };

    releases: {
        albums: {
            releases: Release[];
            total_count: number;
        };
        appears_on: {
            releases: Release[];
            total_count: number;
        };
        compilations: {
            releases: Release[];
            total_count: number;
        };
        singles: {
            releases: Release[];
            total_count: number;
        };
    };

    top_tracks: {
        tracks: {
            explicit: boolean;
            name: string;
            playcount: number;
            release: {
                cover: Cover;
                name: string;
                uri: string;
            };
            uri: string;
        }[];
    };

    upcoming_concerts: {
        inactive_artist: boolean;
    };

    uri: string;
};
