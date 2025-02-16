import { type LocalTrack } from '@shared/platform/local-files';
import { getPlatform } from '@shared/utils/spicetify-utils';

/**
 * Plays a local track with the given context.
 * The track's URI MUST be in the context array.
 * @param trackUri The URI of the track to play.
 * @param context The play context.
 */
export async function playTrack(
    trackUri: string,
    context: LocalTrack[],
): Promise<void> {
    if (context.length === 0 || !context.some((t) => t.uri === trackUri)) {
        return;
    }

    await getPlatform().PlayerAPI.play(
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
export async function playContext(context: LocalTrack[]): Promise<void> {
    if (context.length === 0) {
        return;
    }

    await getPlatform().PlayerAPI.play(
        {
            uri: 'spotify:internal:local-files',
            pages: [{ items: context }],
        },
        {},
        {},
    );
}
