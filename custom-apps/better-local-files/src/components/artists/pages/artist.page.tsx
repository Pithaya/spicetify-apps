import { History, LocalFilesApi } from '@shared';
import React, { useEffect, useState } from 'react';
import { Routes } from '../../../constants/constants';
import { navigateTo } from '../../../helpers/history-helper';
import { ArtistItem } from 'custom-apps/better-local-files/src/models/artist-item';
import { AlbumItem } from 'custom-apps/better-local-files/src/models/album-item';
import { ArtistHeader } from '../track-list/artist-header.component';
import { ArtistTrackList } from '../track-list/artist-track-list';

export function ArtistPage() {
    const api = Spicetify.Platform.LocalFilesAPI as LocalFilesApi;
    const history = Spicetify.Platform.History as History;

    const artistUri = (history.location.state as any).uri ?? null;

    if (artistUri === null) {
        history.replace(Routes.artists);
        return <></>;
    }

    const [artist, setArtist] = useState<ArtistItem | null>(null);
    const [albums, setAlbums] = useState<AlbumItem[]>([]);

    useEffect(() => {
        async function getTracks() {
            const tracks = await api.getTracks();

            const artist = tracks
                .find((a) => a.artists.some((a) => a.uri === artistUri))
                ?.artists.find((a) => a.uri === artistUri);

            if (artist === undefined) {
                navigateTo(Routes.artists);
                return;
            }

            const artistTracks = tracks.filter((a) =>
                a.artists.some((a) => a.uri === artistUri)
            );

            const artistItem: ArtistItem = {
                name: artist.name,
                uri: artist.uri,
                image: artistTracks[0].album.images[0].url,
                tracks: artistTracks,
            };

            // TODO: Refactor into a 'getAlbumsFromTracks' function
            const albumMap = new Map<string, AlbumItem>();

            for (const track of artistTracks) {
                const key =
                    track.album.name === '' ? 'Untitled' : track.album.name;

                if (!albumMap.has(key)) {
                    albumMap.set(key, {
                        name: key,
                        uri: track.album.uri,
                        artists: track.artists,
                        image: track.album.images[0].url,
                        tracks: [track],
                    } as AlbumItem);
                } else {
                    const album = albumMap.get(key)!;

                    for (const artist of track.artists) {
                        if (!album.artists.some((a) => a.uri === artist.uri)) {
                            album.artists.push(artist);
                        }
                    }

                    album.tracks.push(track);
                }
            }

            setArtist(artistItem);
            setAlbums(Array.from(albumMap).map(([key, value]) => value));
        }

        getTracks();
    }, []);

    return (
        <>
            {artist !== null && (
                <>
                    <ArtistHeader artist={artist} />
                    <ArtistTrackList tracks={artist.tracks} />
                </>
            )}
        </>
    );
}
