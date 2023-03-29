import React, { useMemo, useState } from 'react';
import styles from '../../../css/app.module.scss';
import { AlbumCard } from '../cards/album-card';
import { SearchInput } from '../../shared/filters/search-input';
import { playContext } from 'custom-apps/better-local-files/src/helpers/player-helpers';
import { Album } from 'custom-apps/better-local-files/src/models/album';
import { LocalTracksService } from 'custom-apps/better-local-files/src/services/local-tracks-service';
import { getTranslation } from 'custom-apps/better-local-files/src/helpers/translations-helper';
import {
    SelectedSortOption,
    SortOption,
    SortOrder,
} from 'custom-apps/better-local-files/src/models/sort-option';
import { SortMenu } from '../../shared/filters/sort-menu';
import { HeaderKey } from 'custom-apps/better-local-files/src/constants/constants';
import { sort } from 'custom-apps/better-local-files/src/helpers/sort-helper';

export function AlbumsPage() {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const sortOptions: SortOption[] = [
        {
            key: 'title',
            label: getTranslation(['collection.sort.alphabetical']),
        },
    ];

    const albums = Array.from(LocalTracksService.getAlbums()).map(
        ([key, value]) => value
    );

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

    const [selectedSortOption, setSelectedSortOption] =
        useState<SelectedSortOption>({ ...sortOptions[0], order: 'ascending' });

    function orderAlbums(albums: Album[], option: SelectedSortOption) {
        switch (option.key) {
            case 'title':
                return albums.sort((x, y) =>
                    sort(x.name, y.name, option.order)
                );
            default:
                return albums;
        }
    }

    const orderedAlbums = useMemo(
        () => [...orderAlbums(filteredAlbums, selectedSortOption)],
        [filteredAlbums, selectedSortOption]
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

    function playAlbum(album: Album) {
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
