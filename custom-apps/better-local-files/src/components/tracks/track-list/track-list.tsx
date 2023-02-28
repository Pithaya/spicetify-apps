import React, { useMemo, useState } from 'react';
import { LocalTrack } from '@shared';
import { ActionBar } from './action-bar.component';
import { TrackListGrid } from './track-list-grid';
import { playContext, playTrack } from '../../../helpers/player-helpers';
import {
    SelectedSortOption,
    SortOption,
    SortOrder,
} from 'custom-apps/better-local-files/src/models/sort-option';
import { TrackListHeaderOption } from 'custom-apps/better-local-files/src/models/track-list-header-option';
import { HeaderKey } from 'custom-apps/better-local-files/src/constants/constants';

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

    function sort(first: any, second: any, order: SortOrder) {
        const type = order === 'descending' ? -1 : 1;

        if (first > second) {
            return 1 * type;
        }
        if (first < second) {
            return -1 * type;
        }

        return 0;
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

    function playUri(uri: string) {
        playTrack(uri, filteredTracks);
    }

    function playTracks() {
        if (filteredTracks.length === 0) {
            return;
        }

        playContext(filteredTracks);
    }

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

    return (
        <>
            <ActionBar
                onPlayClicked={playTracks}
                search={search}
                setSearch={setSearch}
                debouncedSearch={debouncedSearch}
                setDebouncedSearch={setDebouncedSearch}
                sortOptions={sortOptions}
                selectedSortOption={selectedSortOption}
                setSelectedSortOption={handleSortOptionChange}
            />
            <TrackListGrid
                tracks={orderedTracks}
                onPlayTrack={playUri}
                sortOptions={sortOptions}
                selectedSortOption={selectedSortOption}
                setSelectedSortOption={handleSortOptionChange}
                headers={headers}
                onHeaderClicked={handleSortOptionChange}
                sortedHeader={selectedSortOption}
            />
        </>
    );
}
