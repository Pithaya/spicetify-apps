import styles from '../../../css/app.module.scss';
import React, { useMemo, useState } from 'react';
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
import { sort } from 'custom-apps/better-local-files/src/helpers/sort-helper';
import { Track } from 'custom-apps/better-local-files/src/models/track';
import { getTranslation } from 'custom-apps/better-local-files/src/helpers/translations-helper';

export interface IProps {
    tracks: Track[];
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
            label: getTranslation(['sort.date-added']),
        },
        {
            key: 'title',
            label: getTranslation(['sort.title']),
        },
        {
            key: 'album',
            label: getTranslation(['sort.album']),
        },
        {
            key: 'duration',
            label: getTranslation(['sort.duration']),
        },
    ];

    const headers: TrackListHeaderOption[] = [
        {
            key: 'title',
            label: getTranslation(['tracklist.header.title']),
        },
        {
            key: 'album',
            label: getTranslation(['tracklist.header.album']),
        },
        {
            key: 'date',
            label: getTranslation(['tracklist.header.date-added']),
        },
    ];

    const [selectedSortOption, setSelectedSortOption] =
        useState<SelectedSortOption>({ ...sortOptions[0], order: 'ascending' });

    function filterTracks(tracks: Track[], search: string) {
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

    function orderTracks(tracks: Track[], option: SelectedSortOption) {
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
            case 'duration':
                return tracks.sort((x, y) =>
                    sort(x.duration, y.duration, option.order)
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

    return (
        <>
            <div className={`${styles['action-bar']}`}>
                <PlayButton
                    size={60}
                    iconSize={24}
                    onClick={() =>
                        playContext(orderedTracks.map((t) => t.localTrack))
                    }
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
                gridLabel={getTranslation(['local-files'])}
                onPlayTrack={(uri) =>
                    playTrack(
                        uri,
                        orderedTracks.map((t) => t.localTrack)
                    )
                }
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
