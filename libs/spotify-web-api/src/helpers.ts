import { ArgumentError, SpotifyError } from './models';

export function isSpotifyError(error: unknown): error is SpotifyError {
    return (
        (error as SpotifyError).status !== undefined &&
        (error as SpotifyError).message !== undefined
    );
}

export function handleError(error: any): void {
    if (error instanceof ArgumentError) {
        console.error(error.message);
    }
    if (isSpotifyError(error)) {
        console.error(error.message);
    } else {
        console.error('Unknown error.', error);
    }
}
