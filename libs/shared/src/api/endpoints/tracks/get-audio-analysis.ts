import type { AudioAnalysis } from '@shared/api/models/audio-analysis';
import { getWebApiRequestSender } from '@shared/api/utils/get-web-api-request-builder';
import { getId } from '@shared/utils/uri-utils';
import { z } from 'zod';

const ParamsSchema = z
    .object({
        uri: z
            .string()
            .nonempty({ message: 'Track URI is required' })
            .refine((value) => Spicetify.URI.isTrack(value), {
                message: 'Invalid track URI',
            }),
    })
    .strict()
    .readonly();

export type Params = z.infer<typeof ParamsSchema>;

const getSpAudioData = async (
    uri: string,
): Promise<AudioAnalysis | null | undefined> => {
    return (await Spicetify.getAudioData(uri)) as
        | AudioAnalysis
        | null
        | undefined;
};

/**
 * @deprecated The Spotify Web API can no longer be used with the app's session token.
 */
export async function getTrackAudioAnalysis(
    params: Params,
): Promise<AudioAnalysis> {
    ParamsSchema.parse(params);

    const spicetifyAudioData = await getSpAudioData(params.uri);

    if (spicetifyAudioData) {
        return spicetifyAudioData;
    }

    const id = getId(Spicetify.URI.fromString(params.uri));

    const sender = getWebApiRequestSender();

    const response = await sender
        .withPath(`/audio-analysis/${id}`)
        .withEndpointIdentifier('/audio-analysis/{id}')
        .send<AudioAnalysis>();

    return response.body;
}
