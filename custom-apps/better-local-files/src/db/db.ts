import type {
    HeaderKey,
    LibraryHeaders,
    SortOrder,
} from '@shared/components/track-list/models/sort-option';
import Dexie, { type EntityTable } from 'dexie';
import type { Album } from '../models/album';
import type { CachedAlbum } from '../models/cached-album';
import type { CachedArtist } from '../models/cached-artist';
import type { CachedTrack } from '../models/cached-track';
import { sort } from '../utils/sort.utils';

const dbName = 'better-local-files:cache';
export const dbVersion = 2;

const db = new Dexie(dbName) as Dexie & {
    albums: EntityTable<CachedAlbum, 'uri'>;
    artists: EntityTable<CachedArtist, 'uri'>;
    tracks: EntityTable<CachedTrack, 'uri'>;
};

db.version(dbVersion).stores({
    albums: '&uri, name, nameLower, *artistNamesLower',
    artists: '&uri, name, nameLower',
    tracks: '&uri, name, nameLower, addedAtTime, duration, albumNameLower, firstArtistNameLower, *artistUris, *artistNamesLower',
});

export { db };

export const clearDatabase = async (): Promise<void> => {
    await db.albums.clear();
    await db.artists.clear();
    await db.tracks.clear();

    console.log('Local tracks cache cleared');
};

export const addTracks = async (tracks: CachedTrack[]): Promise<void> => {
    await db.tracks.bulkAdd(tracks);
};

export const addArtists = async (artists: CachedArtist[]): Promise<void> => {
    await db.artists.bulkAdd(artists);
};

export const addAlbums = async (albums: Album[]): Promise<void> => {
    const cachedAlbums: CachedAlbum[] = albums.map((album) => ({
        uri: album.uri,
        name: album.name,
        nameLower: album.name.toLowerCase(),
        image: album.images[0]?.url ?? '',
        artists: album.artists,
        artistNamesLower: album.artists.map((a) => a.name.toLowerCase()),
        discs: Object.fromEntries(
            album.discs
                .entries()
                .map(([discNumber, tracks]) => [
                    discNumber,
                    tracks.map((t) => t.uri),
                ]),
        ),
    }));

    await db.albums.bulkAdd(cachedAlbums);
};

export const getArtistTracks = async (
    artistUri: string,
): Promise<CachedTrack[]> => {
    const artistTracks = await db.tracks
        .where('artistUris')
        .equals(artistUri)
        .distinct()
        .toArray();

    return artistTracks.sort(
        (t1, t2) =>
            sort(t1.album.name, t2.album.name, 'ascending') ||
            sort(t1.discNumber, t2.discNumber, 'ascending') ||
            sort(t1.trackNumber, t2.trackNumber, 'ascending'),
    );
};

/**
 * Lightweight variant of getArtistTracks: returns only the track URIs.
 * Used for playback contexts and context-menus where we don't need full track objects.
 */
export const getArtistTrackUris = async (
    artistUri: string,
): Promise<string[]> => {
    return db.tracks
        .where('artistUris')
        .equals(artistUri)
        .distinct()
        .primaryKeys();
};

/**
 * Indexed field used for `orderBy(...)` per sort key.
 * `null` means there's no scalar index for that key — fall back to nameLower
 * and post-sort in JS on the (already-filtered) result.
 */
const trackSortIndex: Record<HeaderKey<LibraryHeaders>, string | null> = {
    date: 'addedAtTime',
    title: 'nameLower',
    artist: 'firstArtistNameLower',
    album: 'albumNameLower',
    duration: 'duration',
};

export type QueryTracksOptions = {
    search: string;
    sortKey: HeaderKey<LibraryHeaders>;
    sortOrder: SortOrder;
};

export const queryTracks = async (
    opts: QueryTracksOptions,
): Promise<CachedTrack[]> => {
    const indexField = trackSortIndex[opts.sortKey] ?? 'nameLower';

    let tracksCollection = db.tracks.orderBy(indexField);
    if (opts.sortOrder === 'descending') {
        tracksCollection = tracksCollection.reverse();
    }

    if (opts.search !== '') {
        const search = opts.search.toLowerCase();
        tracksCollection = tracksCollection.filter(
            (t) =>
                t.nameLower.includes(search) ||
                t.albumNameLower.includes(search) ||
                t.artistNamesLower.some((n) => n.includes(search)),
        );
    }

    return tracksCollection.toArray();
};

export type QueryAlbumsOptions = {
    search: string;
    sortOrder: SortOrder;
};

export const queryAlbums = async (
    opts: QueryAlbumsOptions,
): Promise<CachedAlbum[]> => {
    let albumCollection = db.albums.orderBy('nameLower');
    if (opts.sortOrder === 'descending') {
        albumCollection = albumCollection.reverse();
    }

    if (opts.search !== '') {
        const search = opts.search.toLowerCase();
        albumCollection = albumCollection.filter(
            (a) =>
                a.nameLower.includes(search) ||
                a.artistNamesLower.some((n) => n.includes(search)),
        );
    }

    return albumCollection.toArray();
};

export type QueryArtistsOptions = {
    search: string;
    sortOrder: SortOrder;
};

export const queryArtists = async (
    opts: QueryArtistsOptions,
): Promise<CachedArtist[]> => {
    let artistCollection = db.artists.orderBy('nameLower');
    if (opts.sortOrder === 'descending') {
        artistCollection = artistCollection.reverse();
    }

    if (opts.search !== '') {
        const search = opts.search.toLowerCase();
        artistCollection = artistCollection.filter((a) =>
            a.nameLower.includes(search),
        );
    }

    return artistCollection.toArray();
};
