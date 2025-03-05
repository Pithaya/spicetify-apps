import type { IArtist } from '@shared/components/track-list/models/interfaces';

/**
 * Represents an artist.
 */
export class Artist implements IArtist {
    /**
     * Creates a new instance of the Artist class.
     * @param name Artist name.
     * @param uri Artist URI.
     * @param image Image to use for the artist's page. Usually the image of the artist's first album.
     */
    constructor(
        public readonly name: string,
        public readonly uri: string,
        public readonly image: string,
    ) {}
}
