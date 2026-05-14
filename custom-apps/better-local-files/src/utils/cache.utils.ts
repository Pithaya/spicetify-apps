import type { LocalTrack } from '@shared/platform/local-files';
import { getPlatform } from '@shared/utils/spicetify-utils';
import { getImageUrlFromAlbum } from '@shared/utils/track.utils';
import { addAlbums, addArtists, addTracks, clearDatabase } from '../db/db';
import { Album } from '../models/album';
import type { CachedArtist } from '../models/cached-artist';
import type { CachedTrack } from '../models/cached-track';
import useAppStore from '../stores/store';
import {
    getImage,
    getImageDataFromCanvas,
    getImageDifferenceWithPixelMatch,
} from './image.utils';
import { sort } from './sort.utils';
import { getHasCache, setHasCache } from './storage.utils';

/**
 * A list of tracks with an associated cover.
 */
type TracksWithCover = {
    tracks: CachedTrack[];
    coverUrl: string;
    cover: ImageData | null;
};

/**
 * Get a proper display name for an album.
 * @param name The name of the album.
 * @returns The name of the album or 'Untitled' if the name is empty.
 */
const getDisplayName = (name: string): string => {
    return name === '' ? 'Untitled' : name;
};

/**
 * Create an URI from an album or artist name.
 * @param name The name of the album or artist.
 * @returns A Spotify URI for this album or artist.
 */
const getUri = (name: string): string => {
    return `spotify:local:${name.toLowerCase().replace(/\s/g, '+')}`;
};

/**
 * Get a list of artists from a string.
 * The string can contain multiple artists separated by a comma or a semicolon.
 * @param artistNames The string containing the artists.
 * @param artistImage The image to use for the artists.
 * @returns A list of artists.
 */
const getArtistsFromString = (
    artistNames: string,
    artistImage: string,
): CachedArtist[] => {
    // known Spotify bug: FLAC files can have duplicate artists
    const uniqueNames = new Set(artistNames.split(/[;,]/).map((a) => a.trim()));

    return [...uniqueNames].map((a) => {
        const displayName = getDisplayName(a);
        return {
            name: displayName,
            nameLower: displayName.toLowerCase(),
            uri: getUri(displayName),
            image: artistImage,
        };
    });
};

export const buildCache = async () => {
    // Do nothing of the cache is set
    if (getHasCache()) {
        return;
    }

    const tracks: Map<string, CachedTrack> = new Map<string, CachedTrack>();
    const artists: Map<string, CachedArtist> = new Map<string, CachedArtist>();
    const albums: Map<string, Album> = new Map<string, Album>();

    try {
        await processLocalTracks(tracks, artists, albums);
        await postProcessAlbums(albums);

        // Update data in the database
        await clearDatabase();

        await addTracks(Array.from(tracks.values()));
        await addArtists(Array.from(artists.values()));
        await addAlbums(Array.from(albums.values()));

        console.log('Local tracks cache updated');
        setHasCache(true);
    } catch (e) {
        console.error('Error while processing', e);

        let errorMessage = 'An error occurred while building the cache';

        if (e instanceof Error) {
            errorMessage += `: ${e.message}`;
        }

        Spicetify.showNotification(errorMessage, true, 5000);
    }
};

/**
 * Process the local tracks to fill the cache database.
 * Will properly parse tracks, albums and artists.
 * Tracks and artists will be stored to the cache database.
 */
const processLocalTracks = async (
    tracks: Map<string, CachedTrack>,
    artists: Map<string, CachedArtist>,
    albums: Map<string, Album>,
): Promise<void> => {
    let localTracks = await getPlatform().LocalFilesAPI.getTracks();

    // TODO: Test for a large amount of tracks, remove this
    localTracks = localTracks.flatMap((t) => {
        const copies: LocalTrack[] = [];

        for (let i = 0; i < 30; i++) {
            copies.push({
                ...t,
                uri: `${t.uri}?copy=${i.toFixed()}`,
                name: `${t.name} Copy ${i.toFixed()}`,
            });
        }

        return copies;
    });

    console.log(`Processing ${localTracks.length.toFixed()} local tracks`);

    for (const localTrack of localTracks) {
        // Add the album
        let album: Album;

        // Recreate an uri from the album's name
        const albumName = getDisplayName(localTrack.album.name);
        const albumKey = getUri(albumName);

        if (albums.has(albumKey)) {
            album = albums.get(albumKey)!;
        } else {
            album = new Album(
                albumKey,
                albumName,
                getImageUrlFromAlbum(localTrack.album),
            );

            albums.set(albumKey, album);
        }

        // Add the track artists
        const trackArtists: CachedArtist[] = localTrack.artists.flatMap((a) =>
            getArtistsFromString(a.name, album.image),
        );

        for (const artist of trackArtists) {
            if (!artists.has(artist.uri)) {
                artists.set(artist.uri, artist);
            }

            if (!album.artists.some((a) => a.uri === artist.uri)) {
                album.artists.push({ uri: artist.uri, name: artist.name });
            }
        }

        // Add the track
        const trackArtistsRefs = trackArtists.map((a) => ({
            uri: a.uri,
            name: a.name,
        }));
        const track: CachedTrack = {
            uri: localTrack.uri,
            name: localTrack.name,
            nameLower: localTrack.name.toLowerCase(),
            addedAt: localTrack.addedAt,
            addedAtTime: localTrack.addedAt.getTime(),
            duration: localTrack.duration.milliseconds,
            discNumber: localTrack.discNumber,
            trackNumber: localTrack.trackNumber,
            isPlayable: localTrack.isPlayable,
            album: {
                uri: album.uri,
                name: album.name,
                images: [{ url: album.image }],
            },
            albumNameLower: album.name.toLowerCase(),
            artists: trackArtistsRefs,
            artistUris: trackArtistsRefs.map((a) => a.uri),
            artistNamesLower: trackArtistsRefs.map((a) => a.name.toLowerCase()),
            firstArtistNameLower: trackArtistsRefs[0]?.name.toLowerCase() ?? '',
        };

        tracks.set(track.uri, track);

        if (!album.discs.has(localTrack.discNumber)) {
            album.discs.set(localTrack.discNumber, []);
        }

        album.discs.get(localTrack.discNumber)?.push(track);
    }
};

/**
 * Post process the albums using the cache.
 */
const postProcessAlbums = async (albums: Map<string, Album>): Promise<void> => {
    const state = useAppStore.getState();

    // Albums to remove (albums to split)
    const albumsToRemove: string[] = [];

    // Albums to add (new albums created from split)
    const albumsToAdd: Album[] = [];

    state.setTotalAlbums(albums.size);
    let albumIndex = 0;

    // Fix different albums with the same name being grouped together
    // Happens when there are albums with the same name but from different artists
    for (const [albumUri, album] of albums.entries()) {
        state.setProcessedAlbums(albumIndex + 1);
        albumIndex++;

        // Split the tracks of this album by cover
        const tracksWithCoverList: TracksWithCover[] =
            await postProcessAlbum(album);

        if (tracksWithCoverList.length <= 1) {
            // All artists belong on this album, do nothing
            continue;
        }

        // Add the original merged album to the list to remove
        albumsToRemove.push(albumUri);

        // Add a new album for each group of tracks that share the same cover
        albumsToAdd.push(...createAlbumsFromCovers(album, tracksWithCoverList));
    }

    // Remove the merged album
    for (const key of albumsToRemove) {
        albums.delete(key);
    }

    // Add the new albums
    for (const album of albumsToAdd) {
        albums.set(album.uri, album);
    }

    // Sort album tracks
    for (const album of albums.values()) {
        for (const [discNumber, tracks] of album.discs.entries()) {
            album.discs.set(
                discNumber,
                tracks.toSorted((t1, t2) =>
                    sort(t1.trackNumber, t2.trackNumber, 'ascending'),
                ),
            );
        }
    }
};

/**
 * Post process the album to fix different albums with the same name being grouped together.
 * Will get the processed album from the cache is the cache is set.
 * @param albumUri The album uri.
 * @param album The album.
 * @returns A list of tracks with the same cover.
 */
const postProcessAlbum = async (album: Album): Promise<TracksWithCover[]> => {
    const tracksWithCover: TracksWithCover[] = [];

    // No cache: process this album

    // Only one artist
    if (album.artists.length <= 1) {
        return [];
    }

    const albumTracks = album.discs.values().toArray().flat();

    // Only one track
    if (albumTracks.length <= 1) {
        return [];
    }

    // Group tracks by their artist(s)
    const albumTracksByArtists = new Map<string, CachedTrack[]>();

    for (const track of albumTracks) {
        const trackArtists = track.artists.map((a) => a.name).join(', ');

        if (albumTracksByArtists.has(trackArtists)) {
            albumTracksByArtists.get(trackArtists)?.push(track);
        } else {
            albumTracksByArtists.set(trackArtists, [track]);
        }
    }

    // All tracks have the same artists
    if (albumTracksByArtists.size === 1) {
        return [];
    }

    // For each artist(s), take the album cover of the first track
    for (const tracks of albumTracksByArtists.values()) {
        const coverUrl = tracks[0].album.images[0]?.url;

        let image: HTMLImageElement;

        try {
            image = await getImage(coverUrl);
        } catch (e) {
            console.error(`Couldn't load image "${coverUrl}"`, e);

            // Separate these tracks
            tracksWithCover.push({
                tracks,
                coverUrl: coverUrl,
                cover: null,
            });

            continue;
        }

        const imageData = getImageDataFromCanvas(image);

        const tracksWithSameCover = tracksWithCover
            .filter((x) => x.cover !== null)
            .find(
                (x) =>
                    getImageDifferenceWithPixelMatch(x.cover!, imageData) === 0,
            );

        if (tracksWithSameCover === undefined) {
            // No tracks with the same cover
            tracksWithCover.push({
                tracks,
                cover: imageData,
                coverUrl: coverUrl,
            });
        } else {
            tracksWithSameCover.tracks.push(...tracks);
        }
    }

    return tracksWithCover;
};

const createAlbumsFromCovers = (
    sourceAlbum: Album,
    tracksWithCoverList: TracksWithCover[],
): Album[] => {
    const newAlbums: Album[] = [];

    for (const [index, tracksWithCover] of tracksWithCoverList.entries()) {
        if (tracksWithCover.tracks.length === 0) {
            // No tracks for this cover, skip
            // Can happen if all tracks for this cover were removed on disk, but stayed in the cache
            continue;
        }

        const firstTrack = tracksWithCover.tracks[0];
        const albumKey = getUri(`${sourceAlbum.name} ${index.toFixed()}`);

        const newAlbum: Album = new Album(
            albumKey,
            sourceAlbum.name,
            tracksWithCover.coverUrl,
        );

        for (const artist of firstTrack.artists) {
            if (!newAlbum.artists.some((a) => a.uri === artist.uri)) {
                newAlbum.artists.push(artist);
            }
        }

        // Update the album for the tracks and set the discs
        for (const track of tracksWithCover.tracks) {
            track.album = {
                uri: newAlbum.uri,
                name: newAlbum.name,
                images: newAlbum.images,
            };

            if (!newAlbum.discs.has(track.discNumber)) {
                newAlbum.discs.set(track.discNumber, []);
            }

            newAlbum.discs.get(track.discNumber)?.push(track);
        }

        newAlbums.push(newAlbum);
    }

    return newAlbums;
};
