import { type WorkflowTrack } from '../../track';
import { NodeProcessor, type BaseNodeData } from '../node-processor';
import { getAlbum, type GetAlbumData } from '@shared/graphQL/queries/get-album';
import type { SimpleTrack } from '@shared/components/track-list/models/interfaces';

export type AlbumData = BaseNodeData & {
    uri?: string;
    offset?: number;
    limit?: number;
    onlyLiked: boolean;
};

/**
 * Source node that returns tracks from an album.
 */
export class AlbumSourceProcessor extends NodeProcessor<AlbumData> {
    protected override async getResultsInternal(): Promise<WorkflowTrack[]> {
        let { offset, limit, uri, onlyLiked } = this.data;

        if (uri === undefined) {
            throw new Error('No URI provided for album source.');
        }

        if (offset === undefined) {
            offset = 0;
        }

        if (limit === undefined) {
            limit = 100;
        }

        const album: GetAlbumData = await getAlbum(
            Spicetify.URI.fromString(uri),
            offset,
            limit,
            Spicetify.Locale.getLocale(),
        );

        let tracks = album.albumUnion.tracksV2.items.map((item) => item.track);

        if (onlyLiked) {
            tracks = tracks.filter((track) => track.saved);
        }

        const mappedTracks: SimpleTrack[] = tracks.map((track) => ({
            uri: track.uri,
            name: track.name,
            artists: track.artists.items.map((artist) => ({
                uri: artist.uri,
                name: artist.profile.name,
            })),
            album: {
                uri,
                name: album.albumUnion.name,
                images: album.albumUnion.coverArt.sources.map((image) => ({
                    url: image.url,
                })),
            },
            duration: {
                milliseconds: track.duration.totalMilliseconds,
            },
            trackNumber: track.trackNumber,
            isPlayable: track.playability.playable,
        }));

        return mappedTracks.map((track) => ({
            ...track,
            source: 'Album',
        }));
    }
}
