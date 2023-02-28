import { LocalFilesApi } from '@shared';
import { playContext } from 'custom-apps/better-local-files/src/helpers/player-helpers';
import { ArtistItem } from 'custom-apps/better-local-files/src/models/artist-item';
import React, { useEffect, useMemo, useState } from 'react';
import styles from '../../../css/app.module.scss';
import { SearchInput } from '../../shared/filters/search-input';
import { CaretDown } from '../../shared/icons/caret-down';
import { ArtistCard } from '../cards/artist-card';

// TODO: Sort by name

export function ArtistsPage() {
    const api = Spicetify.Platform.LocalFilesAPI as LocalFilesApi;

    const [artists, setArtists] = useState<ArtistItem[]>([]);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        async function getTracks() {
            const tracks = await api.getTracks();

            const artistMap = new Map<string, ArtistItem>();

            for (const track of tracks) {
                for (const artist of track.artists) {
                    if (!artistMap.has(artist.uri)) {
                        artistMap.set(artist.uri, {
                            name: artist.name,
                            uri: artist.uri,
                            image: track.album.images[0].url,
                            tracks: [track],
                        } as ArtistItem);
                    } else {
                        artistMap.get(artist.uri)!.tracks.push(track);
                    }
                }
            }

            setArtists(Array.from(artistMap).map(([key, value]) => value));
        }

        getTracks();
    }, []);

    function filterArtists(artists: ArtistItem[], search: string) {
        if (search === '') {
            return artists;
        }

        return artists.filter((a) =>
            a.name.toLowerCase().includes(search.toLowerCase())
        );
    }

    const filteredArtists = useMemo(
        () => filterArtists(artists, debouncedSearch),
        [artists, debouncedSearch]
    );

    function playArtist(artist: ArtistItem) {
        playContext(artist.tracks);
    }

    return (
        <>
            <div className={styles['album-header']}>
                <h1>Artists</h1>

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
                {filteredArtists.map((a) => (
                    <ArtistCard
                        key={a.uri}
                        artist={a}
                        onPlayClicked={playArtist}
                    />
                ))}
            </div>
        </>
    );
}
