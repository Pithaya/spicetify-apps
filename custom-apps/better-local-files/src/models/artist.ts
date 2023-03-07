export class Artist {
    public readonly uri: string;

    constructor(public readonly name: string, public readonly image: string) {
        this.uri = `spotify:local:${name}`;
    }
}
