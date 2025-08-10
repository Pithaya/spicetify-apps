import { z } from 'zod';
import { type WorkflowTrack } from '../../workflow-track';
import { BaseNodeDataSchema } from '../base-node-processor';
import { ResultNodeProcessor } from '../result-node-processor';

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

export class AddToPlaylistProcessor extends ResultNodeProcessor<AddToPlaylistData> {
    protected override executeResultActionInternal(
        tracks: WorkflowTrack[],
    ): void {
        // TODO: implement this
        Spicetify.showNotification(
            `${tracks.length.toFixed()} tracks added to the result tab`,
            false,
            1000,
        );
    }
}
