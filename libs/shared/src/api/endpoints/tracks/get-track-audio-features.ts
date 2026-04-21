import type { AudioFeatures } from '@shared/api/models/audio-features';
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

const getSpAudioFeatures = async (
    uri: string,
): Promise<AudioFeatures | null | undefined> => {
    const uriObj = Spicetify.URI.fromString(uri);
    const uriId = getId(uriObj);

    return (await Spicetify.CosmosAsync.get(
        `https://spclient.wg.spotify.com/audio-attributes/v1/audio-features/${uriId}?format=json`,
    )) as AudioFeatures | null | undefined;
};

/**
 * @deprecated The Spotify Web API can no longer be used with the app's session token.
 */
export async function getTrackAudioFeatures(
    params: Params,
): Promise<AudioFeatures> {
    ParamsSchema.parse(params);

    const spicetifyAudioFeatures = await getSpAudioFeatures(params.uri);

    if (spicetifyAudioFeatures) {
        return spicetifyAudioFeatures;
    }

    const id = getId(Spicetify.URI.fromString(params.uri));

    const sender = getWebApiRequestSender();

    const response = await sender
        .withPath(`/audio-features/${id}`)
        .withEndpointIdentifier('/audio-features/{id}')
        .send<AudioFeatures>();

    return response.body;
}
