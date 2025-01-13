import { splitInChunks } from '@shared/utils/array-utils';
import type { WorkflowTrack } from '../models/track';
import { getCosmosSdkClient } from '@shared/utils/web-api-utils';
import { getId } from '@shared/utils/uri-utils';
import { wait } from '@shared/utils/promise-utils';
import type { AudioFeatures } from '@spotify-web-api';

export async function setAudioFeatures(tracks: WorkflowTrack[]): Promise<void> {
    const sdk = getCosmosSdkClient();
    // Local tracks don't have audio features
    const filteredTracks = tracks.filter(
        (track) =>
            Spicetify.URI.fromString(track.uri).type !==
            Spicetify.URI.Type.LOCAL_TRACK,
    );
    const chunks = splitInChunks(filteredTracks, 50);

    for (const chunk of chunks) {
        const tracksIds: string[] = chunk
            .map((track) => getId(Spicetify.URI.fromString(track.uri)))
            .filter((id) => id) as string[];

        const chunkResult: (AudioFeatures | null)[] =
            await sdk.tracks.audioFeatures(tracksIds);

        for (const track of chunk) {
            const feature = chunkResult.find(
                (result) => result !== null && result.uri === track.uri,
            );

            if (!feature) {
                continue;
            }

            track.audioFeatures = feature;
        }

        // TODO: Handle 429 error and use Retry-After header
        await wait(1000 / 50); // 50 requests per second
    }
}
