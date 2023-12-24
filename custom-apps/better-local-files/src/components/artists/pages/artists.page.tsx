import type { HeaderKey } from 'custom-apps/better-local-files/src/constants/constants';
import { playContext } from 'custom-apps/better-local-files/src/helpers/player-helpers';
import { sort } from 'custom-apps/better-local-files/src/helpers/sort-helper';
import { getTranslation } from 'custom-apps/better-local-files/src/helpers/translations-helper';
import type { Artist } from 'custom-apps/better-local-files/src/models/artist';
import type {
    SelectedSortOption,
    SortOption,
    SortOrder,
} from 'custom-apps/better-local-files/src/models/sort-option';
import React, { useMemo, useState } from 'react';
import styles from '../../../css/app.module.scss';
import { SearchInput } from '../../shared/filters/search-input';
import { SortMenu } from '../../shared/filters/sort-menu';
import { ArtistCard } from '../cards/artist-card';

export function ArtistsPage(): JSX.Element {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const sortOptions: SortOption[] = [
        {
            key: 'title',
            label: getTranslation(['collection.sort.alphabetical']),
        },
    ];

    const artists = Array.from(window.localTracksService.getArtists()).map(
        ([key, value]) => value,
    );

    function filterArtists(artists: Artist[], search: string): Artist[] {
        if (search === '') {
            return artists;
        }

        return artists.filter((a) =>
            a.name.toLowerCase().includes(search.toLowerCase()),
        );
    }

    const filteredArtists = useMemo(
        () => filterArtists(artists, debouncedSearch),
        [artists, debouncedSearch],
    );

    const [selectedSortOption, setSelectedSortOption] =
        useState<SelectedSortOption>({ ...sortOptions[0], order: 'ascending' });

    function orderArtists(
        artists: Artist[],
        option: SelectedSortOption,
    ): Artist[] {
        if (option.key === 'title') {
            return artists.sort((x, y) => sort(x.name, y.name, option.order));
        }
        return artists;
    }

    const orderedArtists = useMemo(
        () => [...orderArtists(filteredArtists, selectedSortOption)],
        [filteredArtists, selectedSortOption],
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

    function playArtist(artist: Artist): void {
        playContext(
            window.localTracksService
                .getArtistTracks(artist.uri)
                .map((t) => t.localTrack),
        );
    }

    return (
        <div className="contentSpacing">
            <div className={`${styles['album-header']} ${styles['pad-top']}`}>
                <h1>{getTranslation(['artists'])}</h1>

                <div className={styles['controls']}>
                    <SearchInput
                        search={search}
                        setSearch={setSearch}
                        setDebouncedSearch={setDebouncedSearch}
                    />

                    <SortMenu
                        sortOptions={sortOptions}
                        selectedSortOption={selectedSortOption}
                        setSelectedSortOption={handleSortOptionChange}
                        displayTypes={['grid']}
                        selectedDisplayType="grid"
                        setSelectedDisplayType={() => {}}
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
        </div>
    );
}
