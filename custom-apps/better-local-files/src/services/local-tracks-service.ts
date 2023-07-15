import { sort } from '../helpers/sort-helper';
import { Album } from '../models/album';
import { Artist } from '../models/artist';
import { Track } from '../models/track';
import { Platform } from '@shared';
import pixelmatch from 'pixelmatch';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage-service';
import { CachedAlbum } from '../models/cached-album';

/**
 * A list of tracks with an associated cover.
 */
type TracksWithCover = {
    tracks: Track[];
    cover: ImageData;
};

export class LocalTracksService {
    private readonly storageService: StorageService = new StorageService();

    private readonly isInitializedSubject: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    private isInitializing: boolean = false;

    /**
     * Indicates if the service data is initialized.
     */
    public readonly isReady$: Observable<boolean> =
        this.isInitializedSubject.asObservable();

    public get isReady(): boolean {
        return this.isInitializedSubject.value;
    }

    private tracks: Map<string, Track> = new Map<string, Track>();
    private albums: Map<string, Album> = new Map<string, Album>();
    private artists: Map<string, Artist> = new Map<string, Artist>();

    public getTracks(): Readonly<Map<string, Track>> {
        return this.tracks;
    }

    public getAlbums(): Readonly<Map<string, Album>> {
        return this.albums;
    }

    public getArtists(): Readonly<Map<string, Artist>> {
        return this.artists;
    }

    private readonly processedAlbumsSubject: BehaviorSubject<number> =
        new BehaviorSubject<number>(0);
    public readonly processedAlbums$: Observable<number> =
        this.processedAlbumsSubject.asObservable();

    private readonly albumCountSubject: BehaviorSubject<number> =
        new BehaviorSubject<number>(0);
    public readonly albumCount$: Observable<number> =
        this.albumCountSubject.asObservable();

    constructor() {}

    /**
     * Get a list of tracks for an artist.
     * @param artistUri The artist URI.
     * @returns The list of tracks for this artist.
     */
    public getArtistTracks(artistUri: string): Track[] {
        return Array.from(this.tracks.values())
            .filter((t) => t.artists.some((a) => a.uri === artistUri))
            .sort(
                (t1, t2) =>
                    sort(t1.album.name, t2.album.name, 'ascending') ||
                    sort(t1.discNumber, t2.discNumber, 'ascending') ||
                    sort(t1.trackNumber, t2.trackNumber, 'ascending')
            );
    }

    /**
     * Get a proper display name for an album.
     * @param name The name of the album.
     * @returns The name of the album or 'Untitled' if the name is empty.
     */
    private getDisplayName(name: string): string {
        // TODO: Localize "Untitled", but always keep it in English for the URI.
        return name === '' ? 'Untitled' : name;
    }

    /**
     * Create a URI from the album name.
     * @param albumName The display name of the album.
     * @returns A Spotify URI for this album.
     */
    private albumKeyFromName(albumName: string): string {
        return `spotify:uri:${albumName.toLowerCase().replace(/\s/g, '+')}`;
    }

    /**
     * Clears the cache.
     */
    public clearCache(): void {
        this.isInitializedSubject.next(false);

        this.storageService.cache = [];
        this.storageService.hasCache = true;

        this.isInitializedSubject.next(true);
    }

    /**
     * Clear the cache and rebuild it.
     */
    public async reset(): Promise<void> {
        this.isInitializedSubject.next(false);

        this.storageService.cache = [];
        this.storageService.hasCache = false;

        await this.init();
    }

    /**
     * Initialize the service. Should only be called once.
     */
    public async init(): Promise<void> {
        // Prevent button spam
        if (this.isReady || this.isInitializing) {
            return;
        }

        this.isInitializing = true;

        this.tracks = new Map<string, Track>();
        this.albums = new Map<string, Album>();
        this.artists = new Map<string, Artist>();

        try {
            await this.processLocalTracks();
            await this.postProcessAlbums();
        } catch (e) {
            console.error(e);
            Spicetify.showNotification(
                `Error while processing local files; clearing the cache: ${e}`,
                true,
                5000
            );

            // Cache is probably in error, clear it.
            this.storageService.cache = [];
            this.storageService.hasCache = true;
        }

        this.isInitializedSubject.next(true);
        this.isInitializing = false;
    }

    /**
     * Process the local tracks to fill the tracks, albums and artists maps.
     */
    private async processLocalTracks(): Promise<void> {
        const localTracks = await Platform.LocalFilesAPI.getTracks();

        for (const localTrack of localTracks) {
            // Add the album
            let album: Album;

            // Recreate an uri from the album's name
            const albumName = this.getDisplayName(localTrack.album.name);
            const albumKey = this.albumKeyFromName(albumName);

            if (!this.albums.has(albumKey)) {
                album = new Album(
                    albumKey,
                    albumName,
                    localTrack.album.images[0].url
                );

                this.albums.set(albumKey, album);
            } else {
                album = this.albums.get(albumKey)!;
            }

            // Add the track artists
            const trackArtists: Artist[] = localTrack.artists.flatMap((a) =>
                this.getArtistsFromString(a.name, album.image)
            );

            for (let artist of trackArtists) {
                if (!this.artists.has(artist.uri)) {
                    this.artists.set(artist.uri, artist);
                }

                if (!album.artists.some((a) => a.uri === artist.uri)) {
                    album.artists.push(artist);
                }
            }

            // Add the track
            const track: Track = new Track(localTrack, album, trackArtists);

            this.tracks.set(track.uri, track);

            if (!album.discs.has(localTrack.discNumber)) {
                album.discs.set(localTrack.discNumber, []);
            }

            album.discs.get(localTrack.discNumber)?.push(track);
        }
    }

    /**
     * Post process the albums using the cache.
     */
    private async postProcessAlbums(): Promise<void> {
        // Cached albums to process
        const hasCache = this.storageService.hasCache;
        const newCache: CachedAlbum[] = [];

        // Temp arrays to avoid editing the map while iterating it
        const albumsToRemove: string[] = [];
        const albumsToAdd: Album[] = [];

        this.albumCountSubject.next(this.albums.size);
        let albumIndex = 0;

        // Fix different albums with the same name being grouped together
        // Happens when there are albums with the same name but from different artists
        for (const [albumUri, album] of this.albums.entries()) {
            this.processedAlbumsSubject.next(albumIndex + 1);
            albumIndex++;

            // Get the album from the cache, or process it.
            const tracksWithCoverList: TracksWithCover[] =
                await this.postProcessAlbum(albumUri, album);

            if (tracksWithCoverList.length <= 1) {
                // All artists belong on this album, do nothing
                continue;
            }

            // Add the original merged album to the list to remove
            albumsToRemove.push(albumUri);

            // Add a new album for each group of tracks that share the same cover
            for (const [
                index,
                tracksWithCover,
            ] of tracksWithCoverList.entries()) {
                if (tracksWithCover.tracks.length === 0) {
                    // No tracks for this cover, skip
                    // Can happen if all tracks for this cover were removed on disk, but stayed in the cache
                    continue;
                }

                const firstTrack = tracksWithCover.tracks[0];
                const albumKey = this.albumKeyFromName(
                    `${album.name} ${index}`
                );

                const newAlbum = new Album(
                    albumKey,
                    album.name,
                    firstTrack.localTrack.album.images[0].url
                );

                for (let artist of firstTrack.artists) {
                    if (!newAlbum.artists.some((a) => a.uri === artist.uri)) {
                        newAlbum.artists.push(artist);
                    }
                }

                // Update the album for the tracks and set the discs
                for (const track of tracksWithCover.tracks) {
                    track.album = newAlbum;

                    if (!newAlbum.discs.has(track.localTrack.discNumber)) {
                        newAlbum.discs.set(track.localTrack.discNumber, []);
                    }

                    newAlbum.discs
                        .get(track.localTrack.discNumber)
                        ?.push(track);
                }

                albumsToAdd.push(newAlbum);
            }

            newCache.push({
                uri: albumUri,
                tracks: tracksWithCoverList.map((tracksWithCover) => {
                    return tracksWithCover.tracks.map((track) => {
                        return track.uri;
                    });
                }),
            });
        }

        //console.log('remove albums:', albumsToRemove);
        //console.log('add albums:', albumsToAdd);

        // Set the cache
        if (!hasCache) {
            this.storageService.cache = newCache;
            this.storageService.hasCache = true;
        }

        // Remove the merged album
        for (const key of albumsToRemove) {
            this.albums.delete(key);
        }

        // Add the new albums
        for (const album of albumsToAdd) {
            this.albums.set(album.uri, album);
        }

        // Sort album tracks
        for (const [albumUri, album] of this.albums.entries()) {
            for (const [discNumber, tracks] of album.discs.entries()) {
                album.discs.set(
                    discNumber,
                    tracks.sort((t1, t2) =>
                        sort(t1.trackNumber, t2.trackNumber, 'ascending')
                    )
                );
            }
        }
    }

    /**
     * Post process the album to fix different albums with the same name being grouped together.
     * Will get the processed album from the cache is the cache is set.
     * @param albumUri The album uri.
     * @param album The album.
     * @returns A list of tracks with the same cover.
     */
    private async postProcessAlbum(
        albumUri: string,
        album: Album
    ): Promise<TracksWithCover[]> {
        const hasCache = this.storageService.hasCache;
        const cache: CachedAlbum[] = this.storageService.cache;

        let tracksWithCover: TracksWithCover[] = [];

        if (hasCache) {
            const cachedAlbum = cache.find((c) => c.uri === albumUri);
            if (cachedAlbum !== undefined) {
                // Album is in cache, get data
                tracksWithCover = cachedAlbum.tracks.map((trackList) => ({
                    cover: null!,
                    tracks: trackList
                        .filter((trackUri) => this.tracks.has(trackUri))
                        .map((trackUri) => this.tracks.get(trackUri)!),
                }));
            }

            // If cache has been processed and this album is not in it: nothing to do
        } else {
            // No cache: process this album

            // Only one artist
            if (album.artists.length <= 1) {
                return [];
            }

            const albumTracks = album.getTracks();

            // Only one track
            if (albumTracks.length <= 1) {
                return [];
            }

            // Group tracks by their artist(s)
            const albumTrackMap = new Map<string, Track[]>();

            for (const track of albumTracks) {
                const trackArtists = track.artists
                    .map((a) => a.name)
                    .join(', ');

                if (albumTrackMap.has(trackArtists)) {
                    albumTrackMap.get(trackArtists)?.push(track);
                } else {
                    albumTrackMap.set(trackArtists, [track]);
                }
            }

            // All tracks have the same artists
            if (albumTrackMap.size === 1) {
                return [];
            }

            // For each artist(s), take the album cover of the first track
            for (const [artists, tracks] of albumTrackMap.entries()) {
                const coverUrl = tracks[0].localTrack.album.images[0].url;

                const image = await this.getImage(coverUrl);

                const imageData = this.getImageDataFromCanvas(image);

                const tracksWithSameCover = tracksWithCover.find(
                    (x) =>
                        this.getImageDifferenceWithPixelMatch(
                            x.cover,
                            imageData
                        ) === 0
                );

                if (tracksWithSameCover === undefined) {
                    // No tracks with the same cover
                    tracksWithCover.push({
                        tracks: tracks,
                        cover: imageData,
                    });
                } else {
                    tracksWithSameCover.tracks.push(...tracks);
                }
            }
        }

        return tracksWithCover;
    }

    /**
     * Get a list of artists from a string.
     * The string can contain multiple artists separated by a comma or a semicolon.
     * @param artistNames The string containing the artists.
     * @param artistImage The image to use for the artist.
     * @returns A list of artists.
     */
    private getArtistsFromString(
        artistNames: string,
        artistImage: string
    ): Artist[] {
        return artistNames
            .split(/(?:,|;)/)
            .map((a) => new Artist(this.getDisplayName(a.trim()), artistImage));
    }

    /**
     * Load an image from an url.
     * @param imageUrl The image url.
     * @returns The image element.
     */
    private async getImage(imageUrl: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const image = new Image();

            image.onload = () => {
                resolve(image);
            };

            image.onerror = (e) => {
                console.error(`Couldn't load image "${imageUrl}"`, e);
                reject(e);
            };

            image.src = imageUrl;
        });
    }

    /**
     * Get image data for an image element by using a canvas.
     * @param img The image element.
     * @returns The image data.
     */
    private getImageDataFromCanvas(img: HTMLImageElement): ImageData {
        const canvas = document.createElement('canvas');

        // Set a small size for the canvas to make the image comparison faster
        canvas.width = 50;
        canvas.height = 50;
        canvas.style.width = '50px';
        canvas.style.height = '50px';

        const ctx = canvas.getContext('2d');

        ctx!.drawImage(img, 0, 0, img.width, img.height, 0, 0, 50, 50);

        return ctx!.getImageData(0, 0, 50, 50);
    }

    /**
     * Get the difference between two images, using pixelmatch.
     * @param imgA The first image.
     * @param imgB The second image.
     * @returns The number of mismatched pixels. If 0, the images are the same.
     */
    private getImageDifferenceWithPixelMatch(
        imgA: ImageData,
        imgB: ImageData
    ): number {
        const mismatchedPixels = pixelmatch(
            imgA.data,
            imgB.data,
            null,
            imgA.width,
            imgA.height,
            { threshold: 0.1 }
        );

        return mismatchedPixels;
    }
}
