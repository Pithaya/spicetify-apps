import type {
    HeaderKey,
    LibraryHeaders,
    SelectedSortOption,
    SortOption,
    SortOrder,
} from '@shared/components/track-list/models/sort-option';
import { getTranslation } from '@shared/utils/translations.utils';
import { queryAlbums } from 'custom-apps/better-local-files/src/db/db';
import type { CachedAlbum } from 'custom-apps/better-local-files/src/models/cached-album';
import { playContext } from 'custom-apps/better-local-files/src/utils/player.utils';
import { useLiveQuery } from 'dexie-react-hooks';
import React, { useState } from 'react';
import styles from '../../../css/app.module.scss';
import { SearchInput } from '../../shared/filters/SearchInput/SearchInput';
import { SortMenu } from '../../shared/filters/SortMenu/SortMenu';
import { AlbumCard } from '../cards/AlbumCard';

function toggleOrder(order: SortOrder): SortOrder {
    return order === 'ascending' ? 'descending' : 'ascending';
}

function playAlbum(album: CachedAlbum): void {
    void playContext(Object.values(album.discs).flat());
}

export function AlbumsPage(): JSX.Element {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const sortOptions: SortOption<LibraryHeaders>[] = [
        {
            key: 'title',
            label: getTranslation(['sort.title']),
        },
    ];

    const [selectedSortOption, setSelectedSortOption] = useState<
        SelectedSortOption<LibraryHeaders>
    >({ ...sortOptions[0], order: 'ascending' });

    const albums = useLiveQuery(
        () =>
            queryAlbums({
                search: debouncedSearch,
                sortOrder: selectedSortOption.order,
            }),
        [debouncedSearch, selectedSortOption.order],
        [],
    );

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

    return (
        <div className="contentSpacing">
            <div
                className={`${styles['details-page-header']} ${styles['pad-top']}`}
            >
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
                        setSelectedDisplayType={() => {
                            // TODO: support other display types
                        }}
                        displayTypeTranslationPrefix="web-player.artist.discography.sort-box.view-"
                    />
                </div>
            </div>

            <div
                id="album-grid"
                className={`${styles['card-grid']} main-gridContainer-gridContainer main-gridContainer-fixedWidth`}
            >
                {albums.map((a) => (
                    <AlbumCard
                        key={a.uri}
                        album={a}
                        onPlayClicked={playAlbum}
                        searchTerm={debouncedSearch}
                    />
                ))}
            </div>
        </div>
    );
}
