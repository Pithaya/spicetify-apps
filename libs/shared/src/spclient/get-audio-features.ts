import type { AudioFeatures } from '@shared/api/models/audio-features';
import { getPlatform } from '@shared/utils/spicetify-utils';
import { getId } from '@shared/utils/uri-utils';

export class AudioFeaturesRequestError extends Error {
    public readonly status: number;
    public readonly retryAfterMs: number | null;

    constructor(message: string, status: number, retryAfterMs: number | null) {
        super(message);
        this.name = 'AudioFeaturesRequestError';
        this.status = status;
        this.retryAfterMs = retryAfterMs;
    }
}

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
        throw new AudioFeaturesRequestError(
            `Failed to get audio features (status ${response.status.toString()}).`,
            response.status,
            parseRetryAfterMs(response.headers),
        );
    }

    return response.body;
}

function parseRetryAfterMs(headers: unknown): number | null {
    if (typeof headers !== 'object' || headers === null) {
        return null;
    }

    const record = headers as Record<string, unknown>;
    const raw = record['Retry-After'] ?? record['retry-after'];

    if (typeof raw === 'number' && Number.isFinite(raw) && raw >= 0) {
        return raw * 1000;
    }

    if (typeof raw === 'string') {
        const seconds = Number(raw);
        if (Number.isFinite(seconds) && seconds >= 0) {
            return seconds * 1000;
        }
        // HTTP-date format is left unparsed — caller falls back to its default.
    }

    return null;
}
