import {
    type DecoratedTrack,
    decorateContextTracks,
} from '@shared/graphQL/queries/decorate-context-tracks';
import { getPlatform } from '@shared/utils/spicetify-utils';
import { z } from 'zod';
import type {
    AdditionalData,
    WorkflowTrack,
} from '../../../types/workflow-track';
import { BaseNodeDataSchema } from '../base-node-processor';
import { NodeProcessor } from '../node-processor';

export const RecentlyPlayedTracksDataSchema = z
    .object({
        limit: z.number().positive().int(),
        offset: z.number().nonnegative().int(),
    })
    .merge(BaseNodeDataSchema)
    .strict();

export type RecentlyPlayedTracksData = z.infer<
    typeof RecentlyPlayedTracksDataSchema
>;

export const DEFAULT_RECENTLY_PLAYED_TRACKS_DATA: RecentlyPlayedTracksData = {
    limit: 50,
    offset: 0,
    isExecuting: undefined,
};

/**
 * Source node that returns the user's most recently played tracks.
 */
export class RecentlyPlayedTracksSourceProcessor extends NodeProcessor<RecentlyPlayedTracksData> {
    protected override async getResultsInternal(): Promise<WorkflowTrack[]> {
        const { limit, offset } = this.data;

        const uris =
            await getPlatform().AssistedCurationAPI.getRecentlyPlayedTracks({
                limit,
                offset,
            });

        if (uris.length === 0) {
            return [];
        }

        const { tracks } = await decorateContextTracks(uris);

        return tracks.map((track) =>
            mapDecoratedTrackToWorkflowTrack(track, {
                source: 'Recently played',
            }),
        );
    }
}

const mapDecoratedTrackToWorkflowTrack = (
    track: DecoratedTrack,
    additionalData: AdditionalData,
): WorkflowTrack => ({
    uri: track.uri,
    name: track.name,
    duration: track.duration.totalMilliseconds,
    artists: track.artists.items.map((artist) => ({
        uri: artist.uri,
        name: artist.profile.name,
    })),
    album: {
        uri: track.albumOfTrack.uri,
        name: track.albumOfTrack.name,
        images: track.albumOfTrack.coverArt.sources.map((image) => ({
            url: image.url,
        })),
    },
    isPlayable: true,
    isExplicit: track.contentRating.label === 'EXPLICIT',
    ...additionalData,
});
