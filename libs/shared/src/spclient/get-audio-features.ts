import type { AudioFeatures } from '@shared/api/models/audio-features';
import { getPlatform } from '@shared/utils/spicetify-utils';
import { getId } from '@shared/utils/uri-utils';

export async function getAudioFeatures(uri: string): Promise<AudioFeatures> {
    if (!Spicetify.URI.isTrack(uri)) {
        throw new Error('The source URI must be a track.');
    }

    const uriObj = Spicetify.URI.fromString(uri);
    const uriId = getId(uriObj);

    const requestBuilder = getPlatform().RequestBuilder;

    const response = await requestBuilder
        .build()
        .withHost('https://spclient.wg.spotify.com/audio-attributes/v1')
        .withPath(`/audio-features/${uriId}`)
        .withEndpointIdentifier('/audio-features/{id}')
        .withQueryParameters({
            format: 'json',
        })
        .withoutMarket()
        .send<AudioFeatures>();

    if (response.status !== 200) {
        throw new Error('Failed to get audio features.');
    }

    return response.body;
}
