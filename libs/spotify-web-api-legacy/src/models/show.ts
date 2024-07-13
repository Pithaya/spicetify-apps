import type { Episode } from './episode';
import type { Image } from './image';

export type Show = {
    /**
     * A list of the countries in which the show can be played, identified by their ISO 3166-1 alpha-2 code.
     */
    available_markets: string[];
    /**
     * The copyright statements of the show.
     */
    copyrights: {
        /**
         * The copyright text for this content.
         */
        text: 'string';
        /**
         * The type of copyright: C = the copyright, P = the sound recording (performance) copyright.
         */
        type: 'string';
    }[];
    /**
     * A description of the show. HTML tags are stripped away from this field, use html_description field in case HTML tags are needed.
     */
    description: 'string';
    /**
     * A description of the show. This field may contain HTML tags.
     */
    html_description: 'string';
    /**
     * Whether or not the show has explicit content (true = yes it does; false = no it does not OR unknown).
     */
    explicit: boolean;
    /**
     * External URLs for this show.
     */
    external_urls: {
        /**
         * The Spotify URL for the object.
         */
        spotify: 'string';
    };
    /**
     * A link to the Web API endpoint providing full details of the show.
     */
    href: 'string';
    /**
     * The Spotify ID for the show.
     */
    id: 'string';
    /**
     * The cover art for the show in various sizes, widest first.
     */
    images: Image[];
    /**
     * True if all of the shows episodes are hosted outside of Spotify's CDN. This field might be null in some cases.
     */
    is_externally_hosted: boolean;
    /**
     * A list of the languages used in the show, identified by their ISO 639 code.
     */
    languages: string[];
    /**
     * The media type of the show.
     */
    media_type: 'string';
    /**
     * The name of the episode.
     */
    name: 'string';
    /**
     * The publisher of the show.
     */
    publisher: 'string';
    /**
     * The object type.
     */
    type: 'show';
    /**
     * The Spotify URI for the show.
     */
    uri: 'string';
    /**
     * The total number of episodes in the show.
     */
    total_episodes: number;
    /**
     * The episodes of the show.
     */
    episodes: {
        /**
         * A link to the Web API endpoint returning the full result of the request.
         * Example: 'https://api.spotify.com/v1/me/shows?offset=0&limit=20'
         */
        href: string;
        /**
         * The maximum number of items in the response (as set in the query or by default).
         */
        limit: number;
        /**
         * URL to the next page of items. (null if none).
         */
        next: string;
        /**
         * The offset of the items returned (as set in the query or by default)
         */
        offset: number;
        /**
         * URL to the previous page of items. (null if none).
         */
        previous: string;
        /**
         * The total number of items available to return.
         */
        total: number;
        items: Pick<
            Episode,
            | 'audio_preview_url'
            | 'description'
            | 'html_description'
            | 'duration_ms'
            | 'explicit'
            | 'external_urls'
            | 'href'
            | 'id'
            | 'images'
            | 'is_externally_hosted'
            | 'is_playable'
            | 'language'
            | 'languages'
            | 'name'
            | 'release_date'
            | 'release_date_precision'
            | 'resume_point'
            | 'type'
            | 'uri'
            | 'restrictions'
        >[];
    };
};
