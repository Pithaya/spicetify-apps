export type SpotifyError = {
    /**
     * The HTTP status code.
     */
    status: number;

    /**
     * A short description of the cause of the error.
     */
    message: string;
};

export class ArgumentError {
    /**
     * A short description of the cause of the error.
     */
    public message: string;

    constructor(message: string) {
        this.message = message;
    }
}
