import type { AudioFeatures } from '@shared/api/models/audio-features';
import { getWebApiRequestSender } from '@shared/api/utils/get-web-api-request-builder';
import { getId } from '@shared/utils/uri-utils';
import { z } from 'zod';

export const MAX_GET_MULTIPLE_AUDIO_FEATURES_IDS = 100;

const ParamsSchema = z
    .object({
        uris: z
            .array(z.string())
            .nonempty()
            .max(MAX_GET_MULTIPLE_AUDIO_FEATURES_IDS)
            .refine(
                (value) => value.every((uri) => Spicetify.URI.isTrack(uri)),
                {
                    message: 'Invalid tracks URIs',
                },
            ),
    })
    .strict()
    .readonly();

export type Params = z.infer<typeof ParamsSchema>;

export type AudioFeaturesCollection = {
    audio_features: AudioFeatures[];
};

const getSpAudioFeatures = async (
    ids: string,
): Promise<AudioFeaturesCollection | null | undefined> => {
    return (await Spicetify.CosmosAsync.get(
        `https://spclient.wg.spotify.com/audio-attributes/v1/audio-features?ids=${ids}&format=json`,
    )) as AudioFeaturesCollection | null | undefined;
};

/**
 * @deprecated The Spotify Web API can no longer be used with the app's session token.
 */
export async function getTracksAudioFeatures(
    params: Params,
): Promise<AudioFeatures[]> {
    ParamsSchema.parse(params);

    const ids = params.uris
        .map((uri) => getId(Spicetify.URI.fromString(uri)))
        .join(',');

    const spicetifyAudioFeatures = await getSpAudioFeatures(ids);

    if (spicetifyAudioFeatures) {
        return spicetifyAudioFeatures.audio_features;
    }

    const sender = getWebApiRequestSender();

    const response = await sender
        .withPath(`/audio-features`)
        .withEndpointIdentifier('/audio-features')
        .withQueryParameters({
            ids: params.uris
                .map((uri) => getId(Spicetify.URI.fromString(uri)))
                .join(','),
        })
        .send<AudioFeaturesCollection>();

    return response.body.audio_features;
}
