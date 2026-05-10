import type { AudioFeatures } from '@shared/api/models/audio-features';
import {
    AudioFeaturesRequestError,
    getAudioFeatures,
} from '@shared/spclient/get-audio-features';
import { splitInChunks } from '@shared/utils/array-utils';
import { wait } from '@shared/utils/promise-utils';
import {
    cacheAudioFeatures,
    getCachedAudioFeaturesByUris,
} from '../db/audio-features/audio-features-db';
import type { WorkflowTrack } from '../types/workflow-track';

/**
 * How many tracks to fetch in parallel.
 */
const FETCH_CONCURRENCY = 10;

/**
 * How long between batches.
 */
const BATCH_DELAY_MS = 20;

/**
 * How many retries when fetching audio features in case of rate limiting.
 */
const MAX_RETRIES = 3;

/**
 * Base backoff time in ms when retrying after rate limiting.
 */
const DEFAULT_BACKOFF_MS = 1000;

export async function setAudioFeatures(tracks: WorkflowTrack[]): Promise<void> {
    // Local tracks don't have audio features
    const filteredTracks = tracks.filter(
        (track) => !Spicetify.URI.isLocalTrack(track.uri),
    );

    if (filteredTracks.length === 0) {
        return;
    }

    // Single round-trip cache lookup for every track URI
    const cached = await getCachedAudioFeaturesByUris(
        filteredTracks.map((track) => track.uri),
    );

    const tracksToFetch: WorkflowTrack[] = [];
    for (const track of filteredTracks) {
        const entry = cached.get(track.uri);
        if (entry) {
            track.audioFeatures = entry.features;
        } else {
            tracksToFetch.push(track);
        }
    }

    if (tracksToFetch.length === 0) {
        return;
    }

    const chunks = splitInChunks(tracksToFetch, FETCH_CONCURRENCY);
    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        await Promise.all(chunk.map(fetchAndCacheForTrack));
        if (i < chunks.length - 1) {
            await wait(BATCH_DELAY_MS);
        }
    }
}

async function fetchAndCacheForTrack(track: WorkflowTrack): Promise<void> {
    const feature = await fetchWithRetry(track.uri);
    if (feature === null) {
        return;
    }

    track.audioFeatures = feature;

    try {
        await cacheAudioFeatures({
            uri: track.uri,
            trackName: track.name,
            features: feature,
        });
    } catch (error) {
        console.error(
            `Failed to cache audio features for track ${track.uri}:`,
            error,
        );
    }
}

async function fetchWithRetry(uri: string): Promise<AudioFeatures | null> {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            return await getAudioFeatures(uri);
        } catch (error) {
            if (
                error instanceof AudioFeaturesRequestError &&
                error.status === 429 &&
                attempt < MAX_RETRIES
            ) {
                const backoffMs =
                    error.retryAfterMs ??
                    DEFAULT_BACKOFF_MS * Math.pow(2, attempt);
                console.warn(
                    `Rate limited fetching audio features for ${uri}, retrying in ${backoffMs.toString()}ms (attempt ${(attempt + 1).toString()}/${MAX_RETRIES.toString()})`,
                );
                await wait(backoffMs);
                continue;
            }

            console.error(
                `Failed to get audio features for track ${uri}:`,
                error,
            );
            return null;
        }
    }

    return null;
}
