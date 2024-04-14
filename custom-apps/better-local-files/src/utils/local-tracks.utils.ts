import type { LocalTrack } from '@shared/platform/local-files';

/**
 * Get the image url from an album. Return an empty string if there is are no images.
 * @param album The album.
 * @returns The image url.
 */
export function getImageUrlFromAlbum(album: LocalTrack['album']): string {
    return album.images.length === 0 ? '' : album.images[0].url ?? '';
}
