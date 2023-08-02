/**
 * Represents an artist.
 */
export class Artist {
    /**
     * Artist URI.
     */
    public readonly uri: string;

    /**
     * Creates a new instance of the Artist class.
     * @param name Artist name.
     * @param image Image to use for the artist's page. Usually the image of the artist's first album.
     */
    constructor(public readonly name: string, public readonly image: string) {
        this.uri = `spotify:local:${name}`;
    }
}
