import type { AudioFeatures } from '@shared/api/models/audio-features';
import { type WorkflowTrack } from '../../types/workflow-track';
import { type BaseNodeData } from './base-node-processor';
import { NodeProcessor } from './node-processor';

/**
 * Shared helpers for processor unit tests.
 *
 * The `getResultsInternal` method on `NodeProcessor` is protected. Tests bypass
 * that by casting — `runProcessor` does this once so individual tests stay tidy
 * and the cast does not leak into assertions.
 *
 * `createTrack` returns a minimal `WorkflowTrack` with sensible defaults. Pass
 * `overrides` for the fields your processor actually reads and leave the rest
 * alone — each test should be explicit about the only inputs it cares about.
 */

let trackCounter = 0;

/**
 * Build a `WorkflowTrack` with defaults, overriding only what the test needs.
 * The generated `uri` is unique per call so set-based processors
 * (intersection/difference/substract/deduplicate) behave naturally unless the
 * test explicitly shares a uri.
 */
export function createTrack(
    overrides: Partial<WorkflowTrack> = {},
): WorkflowTrack {
    trackCounter += 1;

    const track: WorkflowTrack = {
        uri: `spotify:track:test-${trackCounter.toString()}`,
        name: `Test track ${trackCounter.toString()}`,
        artists: [{ uri: 'spotify:artist:test', name: 'Test Artist' }],
        album: {
            uri: 'spotify:album:test',
            name: 'Test Album',
            images: [],
        },
        duration: 180_000,
        isPlayable: true,
        isExplicit: false,
        source: 'test',
        ...overrides,
    };

    return track;
}

/**
 * Build an `AudioFeatures` object with safe defaults. Only the numeric fields
 * the filter reads need to be overridden.
 */
export function createAudioFeatures(
    overrides: Partial<AudioFeatures> = {},
): AudioFeatures {
    const features = {
        danceability: 0.5,
        energy: 0.5,
        key: 0,
        loudness: -10,
        mode: 1,
        speechiness: 0.1,
        acousticness: 0.5,
        instrumentalness: 0.5,
        liveness: 0.5,
        valence: 0.5,
        tempo: 120,
        type: 'audio_features',
        id: 'test',
        uri: 'spotify:track:test',
        track_href: '',
        analysis_url: '',
        duration_ms: 180_000,
        time_signature: 4,
        ...overrides,
    };

    return features;
}

/**
 * Extract the signature of `NodeProcessor.getResultsInternal` without relying
 * on a hand-written type.
 *
 * Protected members are invisible to structural type matching from outside the
 * class hierarchy, so `NodeProcessor<T> extends { getResultsInternal: infer F }`
 * resolves to `never`. Indexed access (`this['getResultsInternal']`) is also
 * rejected on a type parameter. The only path that survives the visibility
 * check is calling the protected method from inside a subclass body and
 * letting TypeScript infer the return type of a public proxy.
 *
 * The probe is `abstract` and never instantiated. If the abstract declaration
 * on `NodeProcessor` changes, `GetResultsInternalSig` picks up the new shape
 * and every consumer of `runProcessor` is rechecked against it.
 */
abstract class GetResultsInternalProbe extends NodeProcessor<BaseNodeData> {
    public _expose(): typeof this.getResultsInternal {
        return this.getResultsInternal.bind(this);
    }
}

type GetResultsInternalSig = ReturnType<GetResultsInternalProbe['_expose']>;

/**
 * Invoke the protected `getResultsInternal` on a processor. This bypasses the
 * lifecycle in `getResults` (setExecuting, caching) — that lifecycle belongs
 * to integration tests, not unit tests on the filtering logic.
 *
 * Parameters and return type are a full rest-spread of the inferred
 * signature: if `getResultsInternal` gains, loses, or changes any argument,
 * every `runProcessor` call site is rechecked. Callers keep passing their
 * arguments positionally — `runProcessor(p, inputByHandle)` still works.
 */
export function runProcessor<T extends BaseNodeData>(
    processor: NodeProcessor<T>,
    ...args: Parameters<GetResultsInternalSig>
): ReturnType<GetResultsInternalSig> {
    return (
        processor as unknown as {
            getResultsInternal: GetResultsInternalSig;
        }
    ).getResultsInternal(...args);
}
