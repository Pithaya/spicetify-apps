import { LocalAlbumURI, LocalFilesApi } from '@shared';
import { sort } from '../helpers/sort-helper';
import { Album } from '../models/album';
import { Artist } from '../models/artist';
import { Track } from '../models/track';

export class LocalTracksService {
    private static readonly artistTempSeparator = '{separator}';
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
        console.log('init');

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

            if (!this._albums.has(localTrack.album.uri)) {
                album = new Album(
                    localTrack.album.uri,
                    localTrack.album.name === ''
                        ? 'Untitled'
                        : localTrack.album.name,
                    localTrack.album.images[0].url
                );

                // Add the album artists
                const albumUri: LocalAlbumURI = Spicetify.URI.fromString(
                    album.uri
                ) as any;
                const artists: Artist[] = this.getArtistsFromString(
                    albumUri.artist,
                    album.image
                );

                album.artists.push(...artists);

                for (let a of artists) {
                    if (!this._artists.has(a.uri)) {
                        this._artists.set(a.uri, a);
                    }
                }

                this._albums.set(localTrack.album.uri, album);
            } else {
                album = this._albums.get(localTrack.album.uri)!;
            }

            // Add the track artists
            const artists: Artist[] = localTrack.artists.flatMap((a) =>
                this.getArtistsFromString(a.name, album.image)
            );
            for (let a of artists) {
                if (!this._artists.has(a.uri)) {
                    this._artists.set(a.uri, a);
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
                artists: artists,
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

        console.log(this._tracks);
        console.log(this._artists);
        console.log(this._albums);
    }

    private static getArtistsFromString(
        artistNames: string,
        artistImage: string
    ): Artist[] {
        return artistNames
            .replace(',', this.artistTempSeparator)
            .replace(';', this.artistTempSeparator)
            .split(this.artistTempSeparator)
            .map((a) => new Artist(a.trim(), artistImage));
    }

    private constructor() {}
}
