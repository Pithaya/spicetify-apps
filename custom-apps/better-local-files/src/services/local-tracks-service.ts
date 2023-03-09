import { LocalAlbumURI, LocalFilesApi } from '@shared';
import { sort } from '../helpers/sort-helper';
import { Album } from '../models/album';
import { Artist } from '../models/artist';
import { Track } from '../models/track';

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

    private static async init(): Promise<void> {
        if (this.isInitialized) {
            return;
        }

        const api = Spicetify.Platform.LocalFilesAPI as LocalFilesApi;

        const localTracks = await api.getTracks();

        this._tracks = new Map<string, Track>();
        this._albums = new Map<string, Album>();
        this._artists = new Map<string, Artist>();

        for (const localTrack of localTracks) {
            // Add the album
            let album: Album;

            // Recreate an uri from the album's name
            const albumName =
                localTrack.album.name === ''
                    ? 'Untitled'
                    : localTrack.album.name;

            // TODO: Use cover data to differenciate albums with the same name ? Too slow for now
            /*const albumCoverB64 = await this.getBase64Image(
                localTrack.album.images[0].url
            );
            const coverData =
                albumCoverB64.match(
                    /(?:(data:text\/plain;base64,))(.*)(?:(=)$)/
                )?.[2] ?? '';*/

            const albumKey = `spotify:uri:${localTrack.album.name
                .toLowerCase()
                .replace(/\s/g, '+')}`;

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
            .map((a) => new Artist(a.trim(), artistImage));
    }

    private static async getBase64Image(imageUrl: string): Promise<string> {
        let blob = new Blob([imageUrl]);
        let url = URL.createObjectURL(blob);

        let response = await fetch(url);
        let resultBlob = await response.blob();

        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();

            fileReader.onload = () => {
                let b64 = fileReader.result;

                if (b64 === null || b64 instanceof ArrayBuffer) {
                    reject();
                } else {
                    resolve(b64);
                }
            };

            fileReader.onerror = (e) => reject(e);

            fileReader.readAsDataURL(resultBlob);
        });
    }

    private constructor() {}
}
