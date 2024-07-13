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

export class ArgumentError extends Error {}
