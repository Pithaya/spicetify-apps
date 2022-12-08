import { Artist, SimplifiedArtist } from './artist';
import { Image } from './image';
import { ReleaseDatePrecision } from './release-date';
import { Restrictions } from './restrictions';

export type AlbumType = 'album' | 'single' | 'compilation';

/**
 * An album.
 */
export type Album = {
    /**
     * The type of the album.
     */
    album_type: AlbumType;

    /**
     * The number of tracks in the album.
     */
    total_tracks: number;

    /**
     * The markets in which the album is available: ISO 3166-1 alpha-2 country codes.
     * NOTE: an album is considered available in a market when at least 1 of its tracks is available in that market.
     */
    available_markets: string[];

    /**
     * Known external URLs for this album.
     */
    external_urls: {
        /**
         * The Spotify URL for the object.
         */
        spotify: string;
    };

    /**
     * A link to the Web API endpoint providing full details of the album.
     */
    href: string;

    /**
     * The Spotify ID for the album.
     */
    id: string;

    /**
     * The cover art for the album in various sizes, widest first.
     */
    images: Image[];

    /**
     * The name of the album.
     * In case of an album takedown, the value may be an empty string.
     */
    name: string;

    /**
     * The date the album was first released.
     */
    release_date: string;

    /**
     * The precision with which release_date value is known.
     */
    release_date_precision: ReleaseDatePrecision;

    /**
     * Included in the response when a content restriction is applied.
     */
    restrictions?: Restrictions;

    /**
     * The object type.
     */
    type: 'album';

    /**
     * The Spotify URI for the album.
     */
    uri: string;

    /**
     * The artists of the album. Each artist object includes a link in href to more detailed information about the artist.
     */
    artists: Artist[];
};

export type SimplifiedAlbum = Pick<
    Album,
    | 'album_type'
    | 'external_urls'
    | 'href'
    | 'id'
    | 'images'
    | 'name'
    | 'release_date'
    | 'release_date_precision'
    | 'total_tracks'
    | 'type'
    | 'uri'
> & {
    artists: SimplifiedArtist[];
};
