import { LocalFilesApi } from '@shared';
import React, { useEffect, useState } from 'react';
import { AlbumItem } from '../../models/album-item';
import styles from '../../css/app.module.scss';
import { AlbumCard } from '../cards/album-card';
import { playContext } from '../helpers/player-helpers';

// TODO: intersection observer

export function AlbumsPage() {
    const api = Spicetify.Platform.LocalFilesAPI as LocalFilesApi;

    const [albums, setAlbums] = useState<AlbumItem[]>([]);

    function playAlbum(album: AlbumItem) {
        playContext(album.tracks);
    }

    useEffect(() => {
        async function getTracks() {
            const tracks = await api.getTracks();

            const albumMap = new Map<string, AlbumItem>();

            for (const track of tracks) {
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

            setAlbums(Array.from(albumMap).map(([key, value]) => value));
        }

        getTracks();
    }, []);

    return (
        <>
            <h1>Albums</h1>

            <div
                className={`${styles['album-grid']} main-gridContainer-gridContainer main-gridContainer-fixedWidth`}
            >
                {albums.map((a) => (
                    <AlbumCard
                        key={a.uri}
                        album={a}
                        onPlayClicked={playAlbum}
                    />
                ))}
            </div>
        </>
    );
}
