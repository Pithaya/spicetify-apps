import { type IAlbum } from '@shared/components/track-list/models/interfaces';

/**
 * Get the image url from an album.
 * Return an empty string if there is are no images.
 * @param album The album.
 * @returns The image url.
 */
export function getImageUrlFromAlbum(album: IAlbum): string {
    return album.images.length === 0 ? '' : album.images[0].url;
}
