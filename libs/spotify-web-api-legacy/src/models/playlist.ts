import type { Image } from './image';

export type Playlist = {
    /**
     * true if the owner allows other users to modify the playlist.
     */
    collaborative: boolean;
    /**
     * The playlist description. Only returned for modified, verified playlists, otherwise null.
     */
    description: string;
    /**
     * Known external URLs for this playlist.
     */
    external_urls: {
        /**
         * The Spotify URL for the object.
         */
        spotify: string;
    };
    /**
     * Information about the followers of the playlist.
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
     * A link to the Web API endpoint providing full details of the playlist.
     */
    href: string;
    /**
     * The Spotify ID for the playlist.
     */
    id: string;
    /**
     * Images for the playlist. The array may be empty or contain up to three images. The images are returned by size in descending order.
     * Note: If returned, the source URL for the image (url) is temporary and will expire in less than a day.
     */
    images: Image[];
    /**
     * The name of the playlist.
     */
    name: string;
    /**
     * The user who owns the playlist
     */
    owner: {
        /**
         * Known public external URLs for this user.
         */
        external_urls: {
            /**
             * The Spotify URL for the object.
             */
            spotify: string;
        };
        /**
         * A link to the Web API endpoint for this user.
         */
        href: string;
        /**
         * The Spotify user ID for this user.
         */
        id: string;
        /**
         * The object type.
         */
        type: 'user';
        /**
         * The Spotify URI for this user.
         */
        uri: string;
        /**
         * The name displayed on the user's profile. null if not available.
         */
        display_name: string;
    };
    /**
     * The playlist's public/private status (if it is added to the user's profile): true the playlist is public, false the playlist is private, null the playlist status is not relevant.
     */
    public: boolean | null;
    /**
     * The version identifier for the current playlist. Can be supplied in other requests to target a specific playlist version.
     */
    snapshot_id: string;
    /**
     * The object type: "playlist".
     */
    type: 'playlist';
    /**
     * The Spotify URI for the playlist.
     */
    uri: string;
};
