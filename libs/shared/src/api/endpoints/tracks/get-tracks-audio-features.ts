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

export async function getTracksAudioFeatures(
    params: Params,
): Promise<AudioFeatures[]> {
    ParamsSchema.parse(params);

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
