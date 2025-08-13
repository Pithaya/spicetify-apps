import { getPlatform } from '@shared/utils/spicetify-utils';
import { z } from 'zod';
import { type WorkflowTrack } from '../../../types/workflow-track';
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

export const DEFAULT_ADD_TO_PLAYLIST_DATA: AddToPlaylistData = {
    playlistUri: '',
    operation: 'add',
    addDuplicateTracks: false,
    isExecuting: undefined,
};

export class AddToPlaylistProcessor extends ResultNodeProcessor<AddToPlaylistData> {
    protected override async executeResultActionInternal(
        tracks: WorkflowTrack[],
    ): Promise<void> {
        const { playlistUri, operation, addDuplicateTracks } = this.data;

        const playlistApi = getPlatform().PlaylistAPI;

        try {
            if (operation == 'replace') {
                // First delete all tracks from playlist
                const playlistTracks =
                    await playlistApi.getContents(playlistUri);

                await playlistApi.remove(
                    playlistUri,
                    playlistTracks.items.map((t) => ({
                        uri: t.uri,
                        uid: t.uid,
                    })),
                );
            }

            let tracksToAdd = tracks.map((t) => t.uri);

            if (!addDuplicateTracks) {
                // Note: only when operation is add
                const playlistTracks =
                    await playlistApi.getContents(playlistUri);

                tracksToAdd = tracksToAdd.filter(
                    (t) => !playlistTracks.items.some((pt) => pt.uri === t),
                );
            }

            if (tracksToAdd.length === 0) {
                Spicetify.showNotification(
                    `No tracks to add to the playlist`,
                    false,
                    4000,
                );

                return;
            }

            await playlistApi.add(playlistUri, tracksToAdd, { after: 'end' });

            Spicetify.showNotification(
                `${tracksToAdd.length.toFixed()} tracks added to the playlist`,
                false,
                4000,
            );
        } catch (e) {
            console.error(e);

            Spicetify.showNotification(
                `Couldn't add tracks to the playlist`,
                true,
                1000,
            );
        }
    }
}
