import { getPlatform } from '@shared/utils/spicetify-utils';

/**
 * Plays a local track with the given context.
 * The track's URI MUST be in the context array.
 * @param trackUri The URI of the track to play.
 * @param context The play context.
 */
export async function playTrack(
    trackUri: string,
    context: string[],
): Promise<void> {
    // eslint-disable-next-line sonarjs/argument-type
    if (context.length === 0 || !context.includes(trackUri)) {
        return;
    }

    await getPlatform().PlayerAPI.play(
        {
            uri: 'spotify:internal:local-files',
            pages: [{ items: context.map((uri) => ({ uri })) }],
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
 * @param context A list of track URIs to play.
 */
export async function playContext(context: string[]): Promise<void> {
    if (context.length === 0) {
        return;
    }

    await getPlatform().PlayerAPI.play(
        {
            uri: 'spotify:internal:local-files',
            pages: [{ items: context.map((uri) => ({ uri })) }],
        },
        {},
        {},
    );
}
