import { sort } from '../helpers/sort-helper';
import { Album } from '../models/album';
import { Artist } from '../models/artist';
import { Track } from '../models/track';
import { Platform } from '@shared';
import pixelmatch from 'pixelmatch';

export class LocalTracksService {
    private static isInitialized: boolean = false;

    private static _tracks: Map<string, Track>;
    private static _albums: Map<string, Album>;
    private static _artists: Map<string, Artist>;

    public static async getTracks(): Promise<Readonly<Map<string, Track>>> {
        if (!this.isInitialized) {
            await this.init();
        }

        return this._tracks;
    }

    public static async getAlbums(): Promise<Readonly<Map<string, Album>>> {
        if (!this.isInitialized) {
            await this.init();
        }

        return this._albums;
    }

    public static async getArtists(): Promise<Readonly<Map<string, Artist>>> {
        if (!this.isInitialized) {
            await this.init();
        }

        return this._artists;
    }

    public static getArtistTracks(artistUri: string): Track[] {
        if (!this.isInitialized) {
            return [];
        }

        return Array.from(this._tracks.values())
            .filter((t) => t.artists.some((a) => a.uri === artistUri))
            .sort(
                (t1, t2) =>
                    sort(t1.album.name, t2.album.name, 'ascending') ||
                    sort(t1.discNumber, t2.discNumber, 'ascending') ||
                    sort(t1.trackNumber, t2.trackNumber, 'ascending')
            );
    }

    private static getDisplayName(name: string): string {
        return name === '' ? 'Untitled' : name;
    }

    private static albumKeyFromName(albumName: string): string {
        return `spotify:uri:${albumName.toLowerCase().replace(/\s/g, '+')}`;
    }

    private static async init(): Promise<void> {
        if (this.isInitialized) {
            return;
        }

        const api = Platform.LocalFilesAPI;

        const localTracks = await api.getTracks();

        this._tracks = new Map<string, Track>();
        this._albums = new Map<string, Album>();
        this._artists = new Map<string, Artist>();

        for (const localTrack of localTracks) {
            // Add the album
            let album: Album;

            // Recreate an uri from the album's name
            const albumName = this.getDisplayName(localTrack.album.name);
            const albumKey = this.albumKeyFromName(albumName);

            if (!this._albums.has(albumKey)) {
                album = new Album(
                    albumKey,
                    albumName,
                    localTrack.album.images[0].url
                );

                this._albums.set(albumKey, album);
            } else {
                album = this._albums.get(albumKey)!;
            }

            // Add the track artists
            const trackArtists: Artist[] = localTrack.artists.flatMap((a) =>
                this.getArtistsFromString(a.name, album.image)
            );

            for (let artist of trackArtists) {
                if (!this._artists.has(artist.uri)) {
                    this._artists.set(artist.uri, artist);
                }

                if (!album.artists.some((a) => a.uri === artist.uri)) {
                    album.artists.push(artist);
                }
            }

            // Add the track
            const track: Track = {
                addedAt: localTrack.addedAt,
                duration: localTrack.duration.milliseconds,
                uri: localTrack.uri,
                name: localTrack.name,
                discNumber: localTrack.discNumber,
                trackNumber: localTrack.trackNumber,
                artists: trackArtists,
                album: album,
                localTrack: localTrack,
            };

            this._tracks.set(track.uri, track);

            if (!album.discs.has(localTrack.discNumber)) {
                album.discs.set(localTrack.discNumber, []);
            }

            album.discs.get(localTrack.discNumber)?.push(track);
        }

        // Temp arrays to avoid editing the map while iterating it
        const albumsToRemove: string[] = [];
        const albumsToAdd: Album[] = [];

        // Fix different albums with the same name being grouped together
        // Happens when there are albums with the same name but from different artists
        for (const [albumUri, album] of this._albums.entries()) {
            // Only one artist
            if (album.artists.length <= 1) {
                continue;
            }

            const albumTracks = album.getTracks();

            // Only one track
            if (albumTracks.length <= 1) {
                continue;
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
                continue;
            }

            const tracksWithCover: {
                tracks: Track[];
                cover: ImageData;
            }[] = [];

            // For each artist(s), take the album cover of the first track
            for (const [artists, tracks] of albumTrackMap.entries()) {
                const coverUrl = tracks[0].localTrack.album.images[0].url;

                //console.time('image');
                const image = await this.getImage(coverUrl);
                //console.timeEnd('image');

                //console.log('image size: ', image.width, image.height);

                //console.time('image data');
                const imageData = this.getImageDataFromCanvas(image);
                //console.timeEnd('image data');

                //console.time('pixelmatch');
                const tracksWithSameCover = tracksWithCover.find(
                    (x) =>
                        this.getImageDifferenceWithPixelMatch(
                            x.cover,
                            imageData
                        ) === 0
                );
                //console.timeEnd('pixelmatch');

                if (tracksWithSameCover === undefined) {
                    // No tracks with the same cover
                    tracksWithCover.push({ tracks: tracks, cover: imageData });
                } else {
                    tracksWithSameCover.tracks.push(...tracks);
                }
            }

            if (tracksWithCover.length === 1) {
                // All artists belong on this album, do nothing
                //console.log('skip');
                continue;
            }

            // Add the original merged album to the list to remove
            albumsToRemove.push(albumUri);

            // Add a new album for each group of tracks that share the same cover
            for (const [index, tracks] of tracksWithCover.entries()) {
                const firstTrack = tracks.tracks[0];
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
                for (const track of tracks.tracks) {
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
        }

        console.log('remove albums:', albumsToRemove);
        console.log('add albums:', albumsToAdd);

        // Remove the merged album
        for (const key of albumsToRemove) {
            this._albums.delete(key);
        }

        // Add the new albums
        for (const album of albumsToAdd) {
            this._albums.set(album.uri, album);
        }

        // Sort album tracks
        for (const [albumUri, album] of this._albums.entries()) {
            for (const [discNumber, tracks] of album.discs.entries()) {
                album.discs.set(
                    discNumber,
                    tracks.sort((t1, t2) =>
                        sort(t1.trackNumber, t2.trackNumber, 'ascending')
                    )
                );
            }
        }

        this.isInitialized = true;
    }

    private static getArtistsFromString(
        artistNames: string,
        artistImage: string
    ): Artist[] {
        return artistNames
            .split(/(?:,|;)/)
            .map((a) => new Artist(this.getDisplayName(a.trim()), artistImage));
    }

    private static async getImage(imageUrl: string): Promise<HTMLImageElement> {
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

    private static getImageDataFromCanvas(img: HTMLImageElement): ImageData {
        const canvas = document.createElement('canvas');

        // Set a small size for the canvas to make the image comparison faster
        canvas.width = 50;
        canvas.height = 50;
        canvas.style.width = '50px';
        canvas.style.height = '50px';

        const ctx = canvas.getContext('2d');

        ctx!.drawImage(img, 0, 0, img.width, img.height, 0, 0, 50, 50);

        //document.body.appendChild(canvas); // for debug

        return ctx!.getImageData(0, 0, 50, 50);
    }

    private static getImageDifferenceWithPixelMatch(
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

    private constructor() {}
}
