import type { RequestBuilder } from '@shared/platform/request-builder';
import { getPlatformApiOrThrow } from '@shared/utils/spicetify-utils';

type Response<TBody> = {
    url: string;
    status: number;
    headers: unknown;
    body: TBody;
    offline: boolean;
    timing: unknown;
    metadata: unknown;
    retries: {
        count: number;
    };
    ok: boolean;
};

type GetRadioPlaylistResponse = {
    total: number;
    mediaItems: [
        {
            uri: string;
        },
    ];
};

/**
 * Get the radio URI from a track, artist or album URI.
 * @param uri The source URI.
 */
export async function getRadioPlaylist(uri: string): Promise<string> {
    const isValidUri =
        Spicetify.URI.isTrack(uri) ||
        Spicetify.URI.isArtist(uri) ||
        Spicetify.URI.isAlbum(uri);

    if (!isValidUri) {
        throw new Error('The source URI must be a track, artist or album URI.');
    }

    const requestBuilder =
        getPlatformApiOrThrow<RequestBuilder>('RequestBuilder');

    // goto /playlist/{id}
    const response = await requestBuilder
        .build()
        .withHost('https://spclient.wg.spotify.com/inspiredby-mix/v2')
        .withPath(`/seed_to_playlist/${uri}`)
        .withQueryParameters({
            'response-format': 'json',
        })
        .withoutMarket()
        .withEndpointIdentifier('/seed_to_playlist/{uri}')
        .send<Response<GetRadioPlaylistResponse>>();

    if (response.status !== 200) {
        throw new Error('Failed to get the radio playlist.');
    }

    return response.body.mediaItems[0].uri;
}
