import { Image } from './image';

/**
 * An artist.
 */
export type Artist = {
    /**
     * Known external URLs for this artist.
     */
    external_urls: {
        /**
         * The Spotify URL for the object.
         */
        spotify: string;
    };
    /**
     * Information about the followers of the artist.
     */
    followers: {
        /**
         * This will always be set to null, as the Web API does not support it at the moment.
         */
        href: null;
        /**
         * The total number of followers.
         */
        total: number;
    };
    /**
     * A list of the genres the artist is associated with. If not yet classified, the array is empty.
     */
    genres: string[];

    /**
     * A link to the Web API endpoint providing full details of the artist.
     */
    href: string;

    /**
     * The Spotify ID for the artist.
     */
    id: string;

    /**
     * Images of the artist in various sizes, widest first.
     */
    images: Image[];

    /**
     * The name of the artist.
     */
    name: string;

    /**
     * The popularity of the artist.
     * The value will be between 0 and 100, with 100 being the most popular.
     * The artist's popularity is calculated from the popularity of all the artist's tracks.
     */
    popularity: number;

    /**
     * The object type.
     */
    type: 'artist';

    /**
     * The Spotify URI for the artist.
     */
    uri: string;
};
