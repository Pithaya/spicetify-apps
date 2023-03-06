import styles from '../../../css/app.module.scss';
import React, { useEffect, useMemo, useState } from 'react';
import { LocalTrack } from '@shared';
import { TrackListGrid } from '../../shared/track-list/track-list-grid';
import { playContext, playTrack } from '../../../helpers/player-helpers';
import {
    SelectedSortOption,
    SortOption,
    SortOrder,
} from 'custom-apps/better-local-files/src/models/sort-option';
import { TrackListHeaderOption } from 'custom-apps/better-local-files/src/models/track-list-header-option';
import { HeaderKey } from 'custom-apps/better-local-files/src/constants/constants';
import { SortMenu } from '../../shared/filters/sort-menu';
import { SearchInput } from '../../shared/filters/search-input';
import { PlayButton } from '../../shared/buttons/play-button';
import { TrackListRowAlbumLink } from '../../shared/track-list/track-list-row-album-link';
import { TrackListRowImageTitle } from '../../shared/track-list/track-list-row-image-title';
import { useCurrentPlayerTrackUri } from 'custom-apps/better-local-files/src/hooks/use-current-uri';
import { sort } from 'custom-apps/better-local-files/src/helpers/sort-helper';

export interface IProps {
    tracks: LocalTrack[];
}

/**
 * Contains the filtering, ordering, and play logic for a list of tracks.
 */
export function TrackList(props: IProps) {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const sortOptions: SortOption[] = [
        {
            key: 'date',
            label: "Date d'ajout",
        },
        {
            key: 'title',
            label: 'Titre',
        },
        {
            key: 'album',
            label: 'Album',
        },
        {
            key: 'duration',
            label: 'Duration',
        },
    ];

    const headers: TrackListHeaderOption[] = [
        {
            key: 'title',
            label: 'Titre',
        },
        {
            key: 'album',
            label: 'Album',
        },
        {
            key: 'date',
            label: 'Ajouté le',
        },
    ];

    const [selectedSortOption, setSelectedSortOption] =
        useState<SelectedSortOption>({ ...sortOptions[0], order: 'ascending' });

    function filterTracks(tracks: LocalTrack[], search: string) {
        if (search === '') {
            return tracks;
        }

        return tracks.filter(
            (t) =>
                t.name.toLowerCase().includes(search.toLowerCase()) ||
                t.album.name.toLowerCase().includes(search.toLowerCase()) ||
                t.artists.some((a) =>
                    a.name.toLowerCase().includes(search.toLowerCase())
                )
        );
    }

    function orderTracks(tracks: LocalTrack[], option: SelectedSortOption) {
        switch (option.key) {
            case 'date':
                return tracks.sort((x, y) =>
                    sort(x.addedAt, y.addedAt, option.order)
                );
            case 'title':
                return tracks.sort((x, y) =>
                    sort(x.name, y.name, option.order)
                );
            case 'album':
                return tracks.sort((x, y) =>
                    sort(x.album.name, y.album.name, option.order)
                );
            default:
                return tracks;
        }
    }

    const filteredTracks = useMemo(
        () => filterTracks(props.tracks, debouncedSearch),
        [props.tracks, debouncedSearch]
    );

    const orderedTracks = useMemo(
        () => [...orderTracks(filteredTracks, selectedSortOption)],
        [filteredTracks, selectedSortOption]
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

    // TODO: Action bar as prop inside the div
    return (
        <>
            <div className={`${styles['action-bar']}`}>
                <PlayButton
                    size={60}
                    iconSize={24}
                    onClick={() => playContext(orderedTracks)}
                />

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

            <TrackListGrid
                tracks={orderedTracks}
                subtracks={[]}
                gridLabel="Local tracks"
                onPlayTrack={(uri) => playTrack(uri, orderedTracks)}
                headers={headers}
                onHeaderClicked={handleSortOptionChange}
                sortedHeader={selectedSortOption}
                getRowContent={(track) => {
                    return [
                        <TrackListRowImageTitle
                            track={track}
                            withArtists={true}
                        />,
                        <TrackListRowAlbumLink track={track} />,
                        <span>{track.addedAt.toLocaleDateString()}</span>,
                    ];
                }}
            />
        </>
    );
}
