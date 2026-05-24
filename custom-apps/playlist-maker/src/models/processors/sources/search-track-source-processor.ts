import { getTrack, type Track } from '@shared/graphQL/queries/get-track';
import { z } from 'zod';
import type {
    AdditionalData,
    WorkflowTrack,
} from '../../../types/workflow-track';
import { BaseNodeDataSchema } from '../base-node-processor';
import { NodeProcessor } from '../node-processor';

export const SearchTrackDataSchema = z
    .object({
        uri: z
            .string()
            .nonempty({ message: 'Track URI is required' })
            .refine((value) => Spicetify.URI.isTrack(value), {
                message: 'Invalid track URI',
            }),
    })
    .merge(BaseNodeDataSchema)
    .strict();

export type SearchTrackData = z.infer<typeof SearchTrackDataSchema>;

export const DEFAULT_SEARCH_TRACK_DATA: SearchTrackData = {
    uri: '',
    isExecuting: undefined,
};

/**
 * Source node that returns a single track from Spotify's search.
 */
export class SearchTrackSourceProcessor extends NodeProcessor<SearchTrackData> {
    protected override async getResultsInternal(): Promise<WorkflowTrack[]> {
        const { uri } = this.data;

        const response = await getTrack({ uri });

        if (response.trackUnion.__typename === 'NotFound') {
            return [];
        }

        return [
            mapSearchTrackToWorkflowTrack(response.trackUnion, {
                source: 'Track',
            }),
        ];
    }
}

const mapSearchTrackToWorkflowTrack = (
    track: Track,
    additionalData: AdditionalData,
): WorkflowTrack => ({
    uri: track.uri,
    name: track.name,
    duration: track.duration.totalMilliseconds,
    artists: [...track.firstArtist.items, ...track.otherArtists.items].map(
        (artist) => ({
            uri: artist.uri,
            name: artist.profile.name,
        }),
    ),
    album: {
        uri: track.albumOfTrack.uri,
        name: track.albumOfTrack.name,
        images: track.albumOfTrack.coverArt.sources.map((image) => ({
            url: image.url,
        })),
    },
    isPlayable: track.playability.playable,
    isExplicit: track.contentRating.label === 'EXPLICIT',
    ...additionalData,
});
