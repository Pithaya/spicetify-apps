import type {
    HeaderKey,
    LibraryHeaders,
    SelectedSortOption,
    SortOption,
    SortOrder,
} from '@shared/components/track-list/models/sort-option';
import { getTranslation } from '@shared/utils/translations.utils';
import type { Artist } from 'custom-apps/better-local-files/src/models/artist';
import { playContext } from 'custom-apps/better-local-files/src/utils/player.utils';
import { sort } from 'custom-apps/better-local-files/src/utils/sort.utils';
import React, { useMemo, useState } from 'react';
import styles from '../../../css/app.module.scss';
import { SearchInput } from '../../shared/filters/SearchInput/SearchInput';
import { SortMenu } from '../../shared/filters/SortMenu/SortMenu';
import { ArtistCard } from '../cards/ArtistCard';

export function ArtistsPage(): JSX.Element {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const sortOptions: SortOption<LibraryHeaders>[] = [
        {
            key: 'title',
            label: getTranslation(['collection.sort.alphabetical']),
        },
    ];

    const artists = Array.from(window.localTracksService.getArtists()).map(
        ([_, value]) => value,
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

    const [selectedSortOption, setSelectedSortOption] = useState<
        SelectedSortOption<LibraryHeaders>
    >({ ...sortOptions[0], order: 'ascending' });

    function orderArtists(
        artists: Artist[],
        option: SelectedSortOption<LibraryHeaders>,
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

    function handleSortOptionChange(
        headerKey: HeaderKey<LibraryHeaders>,
    ): void {
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
                .map((t) => t.backingTrack),
        );
    }

    return (
        <div className="contentSpacing">
            <div
                className={`${styles['details-page-header']} ${styles['pad-top']}`}
            >
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
                className={`${styles['card-grid']} main-gridContainer-gridContainer main-gridContainer-fixedWidth`}
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
