import React, { useEffect, useMemo, useState } from 'react';
import styles from '../../../css/app.module.scss';
import { AlbumCard } from '../cards/album-card';
import { SearchInput } from '../../shared/filters/search-input';
import { playContext } from 'custom-apps/better-local-files/src/helpers/player-helpers';
import { CaretDown } from '../../shared/icons/caret-down';
import { Album } from 'custom-apps/better-local-files/src/models/album';
import { LocalTracksService } from 'custom-apps/better-local-files/src/services/local-tracks-service';

// TODO: Sort by name or artist

export function AlbumsPage() {
    const [albums, setAlbums] = useState<Album[]>([]);

    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        async function getAlbums() {
            const albums = await LocalTracksService.getAlbums();
            setAlbums(Array.from(albums).map(([key, value]) => value));
        }

        getAlbums();
    }, []);

    function filterAlbums(albums: Album[], search: string) {
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

    function playAlbum(album: Album) {
        playContext(album.getTracks().map((t) => t.localTrack));
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
