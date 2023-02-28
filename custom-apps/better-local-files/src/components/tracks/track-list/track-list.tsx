import React, { useMemo, useState } from 'react';
import { LocalTrack } from '@shared';
import { ActionBar } from './action-bar.component';
import { TrackListGrid } from './track-list-grid';
import { playContext, playTrack } from '../../../helpers/player-helpers';
import {
    SelectedSortOption,
    SortOption,
} from 'custom-apps/better-local-files/src/models/sort-option';

export interface IProps {
    tracks: LocalTrack[];
}

// TODO: Sort by date, title, artist and album

export function TrackList(props: IProps) {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const sortOptions: SortOption[] = [
        {
            key: 'date',
            label: "Date d'ajout",
        },
        {
            key: 'name',
            label: 'Titre',
        },
        {
            key: 'artist',
            label: 'Artiste',
        },
        {
            key: 'album',
            label: 'Album',
        },
    ];

    const [selectedSortOption, setSelectedSortOption] =
        useState<SelectedSortOption>({ ...sortOptions[0], order: 'asc' });

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

    function sort(first: any, second: any, order: 'asc' | 'desc') {
        const type = order === 'desc' ? -1 : 1;

        if (first > second) {
            return 1 * type;
        }
        if (first < second) {
            return -1 * type;
        }

        return 0;
    }

    function orderTracks(tracks: LocalTrack[], option: SelectedSortOption) {
        // TODO: type strings
        switch (option.key) {
            case 'date':
                return tracks.sort((x, y) =>
                    sort(x.addedAt, y.addedAt, option.order)
                );
            case 'name':
                return tracks.sort((x, y) =>
                    sort(x.name, y.name, option.order)
                );
            case 'artist':
                // TODO: How to sort ?
                return tracks.sort((x, y) =>
                    sort(x.artists[0].name, y.artists[0].name, option.order)
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

    function toggleOrder(order: string): 'asc' | 'desc' {
        return order === 'asc' ? 'desc' : 'asc';
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
                setSelectedSortOption={(o) =>
                    setSelectedSortOption((previous) => ({
                        ...o,
                        order:
                            previous.key === o.key
                                ? toggleOrder(previous.order)
                                : 'asc',
                    }))
                }
            />
            <TrackListGrid
                tracks={orderedTracks}
                onPlayTrack={playUri}
                sortOptions={sortOptions}
                selectedSortOption={selectedSortOption}
                setSelectedSortOption={(o) =>
                    setSelectedSortOption((previous) => ({
                        ...o,
                        order:
                            previous.key === o.key
                                ? toggleOrder(previous.order)
                                : 'asc',
                    }))
                }
            />
        </>
    );
}
