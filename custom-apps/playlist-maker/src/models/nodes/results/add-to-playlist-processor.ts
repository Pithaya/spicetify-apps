import { z } from 'zod';
import { type WorkflowTrack } from '../../workflow-track';
import { BaseNodeDataSchema, NodeProcessor } from '../node-processor';

export const AddToPlaylistDataSchema = z
    .object({
        playlistUri: z
            .string()
            .nonempty({ message: 'Playlist URI is required' })
            .refine((value) => Spicetify.URI.isPlaylistV1OrV2(value), {
                message: 'Invalid playlist URI',
            }),
        operation: z.enum(['add', 'replace']),
        addDuplicateTracks: z.boolean(),
    })
    .merge(BaseNodeDataSchema)
    .strict();

export type AddToPlaylistData = z.infer<typeof AddToPlaylistDataSchema>;

export class AddToPlaylistProcessor extends NodeProcessor<AddToPlaylistData> {
    protected override getResultsInternal(
        inputByHandle: Record<string, WorkflowTrack[]>,
    ): Promise<WorkflowTrack[]> {
        return Promise.resolve(inputByHandle['source'] ?? []);
    }
}
