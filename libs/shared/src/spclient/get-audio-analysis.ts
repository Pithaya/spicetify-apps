import type { AudioAnalysis } from '@shared/api/models/audio-analysis';
import { getPlatform } from '@shared/utils/spicetify-utils';
import { getId } from '@shared/utils/uri-utils';

export async function getAudioAnalysis(uri: string): Promise<AudioAnalysis> {
    if (!Spicetify.URI.isTrack(uri)) {
        throw new Error('The source URI must be a track.');
    }

    const uriObj = Spicetify.URI.fromString(uri);
    const uriId = getId(uriObj);

    const requestBuilder = getPlatform().RequestBuilder;

    const response = await requestBuilder
        .build()
        .withHost('https://spclient.wg.spotify.com/audio-attributes/v1')
        .withPath(`/audio-analysis/${uriId}`)
        .withEndpointIdentifier('/audio-analysis/{id}')
        .withQueryParameters({
            format: 'json',
        })
        .withoutMarket()
        .send<AudioAnalysis>();

    if (response.status !== 200) {
        throw new Error('Failed to get audio analysis.');
    }

    return response.body;
}
