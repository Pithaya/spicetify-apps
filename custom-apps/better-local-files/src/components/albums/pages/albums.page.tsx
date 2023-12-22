import React, { useMemo, useState } from 'react';
import styles from '../../../css/app.module.scss';
import { AlbumCard } from '../cards/album-card';
import { SearchInput } from '../../shared/filters/search-input';
import { playContext } from 'custom-apps/better-local-files/src/helpers/player-helpers';
import type { Album } from 'custom-apps/better-local-files/src/models/album';
import { getTranslation } from 'custom-apps/better-local-files/src/helpers/translations-helper';
import type {
    SelectedSortOption,
    SortOption,
    SortOrder,
} from 'custom-apps/better-local-files/src/models/sort-option';
import { SortMenu } from '../../shared/filters/sort-menu';
import type { HeaderKey } from 'custom-apps/better-local-files/src/constants/constants';
import { sort } from 'custom-apps/better-local-files/src/helpers/sort-helper';

export function AlbumsPage(): JSX.Element {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const sortOptions: SortOption[] = [
        {
            key: 'title',
            label: getTranslation(['collection.sort.alphabetical']),
        },
    ];

    const albums = Array.from(window.localTracksService.getAlbums()).map(
        ([key, value]) => value,
    );

    function filterAlbums(albums: Album[], search: string): Album[] {
        if (search === '') {
            return albums;
        }

        return albums.filter(
            (a) =>
                a.name.toLowerCase().includes(search.toLowerCase()) ||
                a.artists.some((a) =>
                    a.name.toLowerCase().includes(search.toLowerCase()),
                ),
        );
    }

    const filteredAlbums = useMemo(
        () => filterAlbums(albums, debouncedSearch),
        [albums, debouncedSearch],
    );

    const [selectedSortOption, setSelectedSortOption] =
        useState<SelectedSortOption>({ ...sortOptions[0], order: 'ascending' });

    function orderAlbums(albums: Album[], option: SelectedSortOption): Album[] {
        if (option.key === 'title') {
            return albums.sort((x, y) => sort(x.name, y.name, option.order));
        }
        return albums;
    }

    const orderedAlbums = useMemo(
        () => [...orderAlbums(filteredAlbums, selectedSortOption)],
        [filteredAlbums, selectedSortOption],
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

    function playAlbum(album: Album): void {
        playContext(album.getTracks().map((t) => t.localTrack));
    }

    return (
        <>
            <div className={styles['album-header']}>
                <h1>{getTranslation(['albums'])}</h1>

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
                {orderedAlbums.map((a) => (
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
