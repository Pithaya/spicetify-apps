import type { LocalTrack } from '@shared/platform/local-files';

/**
 * Plays a local track with the given context.
 * The track's URI MUST be in the context array.
 * @param trackUri The URI of the track to play.
 * @param context The play context.
 */
export function playTrack(trackUri: string, context: LocalTrack[]): void {
    if (context.length === 0 || !context.some((t) => t.uri === trackUri)) {
        return;
    }

    // TODO: Type and use Platform.PlayerAPI
    (Spicetify.Player as any).origin.play(
        {
            uri: 'spotify:internal:local-files',
            pages: [{ items: context }],
        },
        {},
        {
            skipTo: {
                uri: trackUri,
            },
        },
    );
}

/**
 * Play a list of tracks as a context.
 * @param context A list of tracks to play.
 */
export function playContext(context: LocalTrack[]): void {
    if (context.length === 0) {
        return;
    }

    (Spicetify.Player as any).origin.play(
        {
            uri: 'spotify:internal:local-files',
            pages: [{ items: context }],
        },
        {},
        {},
    );
}
