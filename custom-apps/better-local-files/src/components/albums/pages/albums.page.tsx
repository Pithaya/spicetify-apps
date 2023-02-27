import { LocalFilesApi } from '@shared';
import React, { useEffect, useMemo, useState } from 'react';
import { AlbumItem } from '../../../models/album-item';
import styles from '../../../css/app.module.scss';
import { AlbumCard } from '../cards/album-card';
import { SearchInput } from '../../shared/filters/search-input';
import { playContext } from 'custom-apps/better-local-files/src/helpers/player-helpers';
import { CaretDown } from '../../shared/icons/caret-down';

// TODO: Sort by name or artist

export function AlbumsPage() {
    const api = Spicetify.Platform.LocalFilesAPI as LocalFilesApi;

    const [albums, setAlbums] = useState<AlbumItem[]>([]);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

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

    function filterAlbums(albums: AlbumItem[], search: string) {
        if (search === '') {
            return albums;
        }

        return albums.filter(
            (a) =>
                a.name.toLowerCase().includes(search.toLowerCase()) ||
                a.artists.some((a) =>
                    a.name.toLowerCase().includes(search.toLowerCase())
                )
        );
    }

    const filteredAlbums = useMemo(
        () => filterAlbums(albums, debouncedSearch),
        [albums, debouncedSearch]
    );

    function playAlbum(album: AlbumItem) {
        playContext(album.tracks);
    }

    return (
        <>
            <div className={styles['album-header']}>
                <h1>Albums</h1>

                <div className={styles['controls']}>
                    <SearchInput
                        search={search}
                        setSearch={setSearch}
                        debouncedSearch={debouncedSearch}
                        setDebouncedSearch={setDebouncedSearch}
                    />

                    <button
                        className="x-sortBox-sortDropdown"
                        type="button"
                        aria-expanded="false"
                    >
                        <span data-encore-id="type">Date d'ajout</span>
                        <CaretDown />
                    </button>
                </div>
            </div>

            <div
                className={`${styles['album-grid']} main-gridContainer-gridContainer main-gridContainer-fixedWidth`}
            >
                {filteredAlbums.map((a) => (
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
