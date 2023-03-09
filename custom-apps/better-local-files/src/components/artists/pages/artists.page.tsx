import { HeaderKey } from 'custom-apps/better-local-files/src/constants/constants';
import { playContext } from 'custom-apps/better-local-files/src/helpers/player-helpers';
import { sort } from 'custom-apps/better-local-files/src/helpers/sort-helper';
import { getTranslation } from 'custom-apps/better-local-files/src/helpers/translations-helper';
import { Artist } from 'custom-apps/better-local-files/src/models/artist';
import {
    SelectedSortOption,
    SortOption,
    SortOrder,
} from 'custom-apps/better-local-files/src/models/sort-option';
import { LocalTracksService } from 'custom-apps/better-local-files/src/services/local-tracks-service';
import React, { useEffect, useMemo, useState } from 'react';
import styles from '../../../css/app.module.scss';
import { SearchInput } from '../../shared/filters/search-input';
import { SortMenu } from '../../shared/filters/sort-menu';
import { ArtistCard } from '../cards/artist-card';

export function ArtistsPage() {
    const [artists, setArtists] = useState<Artist[]>([]);

    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const sortOptions: SortOption[] = [
        {
            key: 'title',
            label: getTranslation(['collection.sort.alphabetical']),
        },
    ];

    useEffect(() => {
        async function getArtists() {
            const artists = await LocalTracksService.getArtists();
            setArtists(Array.from(artists).map(([key, value]) => value));
        }

        getArtists();
    }, []);

    function filterArtists(artists: Artist[], search: string) {
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

    const [selectedSortOption, setSelectedSortOption] =
        useState<SelectedSortOption>({ ...sortOptions[0], order: 'ascending' });

    function orderArtists(artists: Artist[], option: SelectedSortOption) {
        switch (option.key) {
            case 'title':
                return artists.sort((x, y) =>
                    sort(x.name, y.name, option.order)
                );
            default:
                return artists;
        }
    }

    const orderedArtists = useMemo(
        () => [...orderArtists(filteredArtists, selectedSortOption)],
        [filteredArtists, selectedSortOption]
    );

    function toggleOrder(order: SortOrder): SortOrder {
        return order === 'ascending' ? 'descending' : 'ascending';
    }

    function handleSortOptionChange(headerKey: HeaderKey): void {
        setSelectedSortOption((previous) => ({
            key: headerKey,
            order:
                previous.key === headerKey
                    ? toggleOrder(previous.order)
                    : 'ascending',
        }));
    }

    function playArtist(artist: Artist) {
        playContext(
            LocalTracksService.getArtistTracks(artist.uri).map(
                (t) => t.localTrack
            )
        );
    }

    return (
        <>
            <div className={styles['album-header']}>
                <h1>{getTranslation(['artists'])}</h1>

                <div className={styles['controls']}>
                    <SearchInput
                        search={search}
                        setSearch={setSearch}
                        debouncedSearch={debouncedSearch}
                        setDebouncedSearch={setDebouncedSearch}
                    />

                    <SortMenu
                        sortOptions={sortOptions}
                        selectedSortOption={selectedSortOption}
                        setSelectedSortOption={handleSortOptionChange}
                    />
                </div>
            </div>

            <div
                className={`${styles['album-grid']} main-gridContainer-gridContainer main-gridContainer-fixedWidth`}
            >
                {orderedArtists.map((a) => (
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
