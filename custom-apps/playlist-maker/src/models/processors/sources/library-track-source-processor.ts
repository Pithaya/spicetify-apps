import { getTrack, type Track } from '@shared/graphQL/queries/get-track';
import { z } from 'zod';
import type {
    AdditionalData,
    WorkflowTrack,
} from '../../../types/workflow-track';
import { BaseNodeDataSchema } from '../base-node-processor';
import { NodeProcessor } from '../node-processor';

export const LibraryTrackDataSchema = z
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

export type LibraryTrackData = z.infer<typeof LibraryTrackDataSchema>;

export const DEFAULT_LIBRARY_TRACK_DATA: LibraryTrackData = {
    uri: '',
    isExecuting: undefined,
};

/**
 * Source node that returns a single saved track from the user's library.
 */
export class LibraryTrackSourceProcessor extends NodeProcessor<LibraryTrackData> {
    protected override async getResultsInternal(): Promise<WorkflowTrack[]> {
        const { uri } = this.data;

        const response = await getTrack({ uri });

        if (response.trackUnion.__typename === 'NotFound') {
            return [];
        }

        return [
            mapLibraryTrackToWorkflowTrack(response.trackUnion, {
                source: 'Saved track',
            }),
        ];
    }
}

const mapLibraryTrackToWorkflowTrack = (
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
