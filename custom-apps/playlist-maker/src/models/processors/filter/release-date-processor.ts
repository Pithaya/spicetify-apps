import { getAlbum, type GetAlbumData } from '@shared/graphQL/queries/get-album';
import { DateTime } from 'luxon';
import { z } from 'zod';
import { type WorkflowTrack } from '../../../types/workflow-track';
import { BaseNodeDataSchema } from '../base-node-processor';
import { NodeProcessor } from '../node-processor';

export const ReleaseDateDataSchema = z
    .object({
        minDate: z.date().optional().nullable(),
        maxDate: z.date().optional().nullable(),
    })
    .merge(BaseNodeDataSchema)
    .strict()
    .refine(
        (data) => {
            if (!!data.minDate && !!data.maxDate) {
                return data.minDate <= data.maxDate;
            }

            return true;
        },
        {
            message: 'The minimum date must be before the maximum date',
            path: ['minDate'],
        },
    );

export type ReleaseDateData = z.infer<typeof ReleaseDateDataSchema>;

export const DEFAULT_RELEASE_DATE_DATA: ReleaseDateData = {
    minDate: undefined,
    maxDate: undefined,
    isExecuting: undefined,
};

/**
 * Filter node that filters tracks based on their album's release date.
 */
export class ReleaseDateProcessor extends NodeProcessor<ReleaseDateData> {
    private static readonly albumMap = new Map<string, GetAlbumData>();

    protected override async getResultsInternal(
        inputByHandle: Record<string, WorkflowTrack[]>,
    ): Promise<WorkflowTrack[]> {
        const input = inputByHandle['source'] ?? [];

        const { minDate, maxDate } = this.data;

        const tracksWithoutAlbumData = input.filter(
            (track) => track.albumData === undefined,
        );

        await this.setAlbumData(tracksWithoutAlbumData);

        const minDateTime = minDate
            ? DateTime.fromJSDate(minDate).startOf('day')
            : undefined;
        const maxDateTime = maxDate
            ? DateTime.fromJSDate(maxDate).startOf('day')
            : undefined;

        const filtered = input.filter((track) => {
            const releaseDate = track.albumData?.releaseDate;
            if (!releaseDate) {
                return false; // Shouldn't happen
            }

            const releaseDateTime =
                DateTime.fromJSDate(releaseDate).startOf('day');

            return (
                (minDateTime === undefined
                    ? true
                    : releaseDateTime >= minDateTime) &&
                (maxDateTime === undefined
                    ? true
                    : releaseDateTime <= maxDateTime)
            );
        });

        return filtered;
    }

    private async setAlbumData(tracks: WorkflowTrack[]): Promise<void> {
        for (const track of tracks) {
            const albumUri = track.album.uri;

            if (!ReleaseDateProcessor.albumMap.has(albumUri)) {
                ReleaseDateProcessor.albumMap.set(
                    albumUri,
                    await getAlbum({
                        uri: albumUri,
                        offset: 0,
                        limit: 0,
                        locale: Spicetify.Locale.getLocale(),
                    }),
                );
            }

            const albumData = ReleaseDateProcessor.albumMap.get(albumUri)!;

            track.albumData = {
                releaseDate: new Date(albumData.albumUnion.date.isoString),
            };
        }
    }
}
