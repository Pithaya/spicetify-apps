import styles from './css/app.module.scss';
import React, { useEffect, useMemo, useState } from 'react';
import { LocalTrack } from '@shared';
import { ActionBar } from './action-bar.component';
import { TrackListGrid } from './track-list-grid';
import { playContext, playTrack } from '../helpers/player-helpers';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

export interface IProps {
    tracks: LocalTrack[];
}

// TODO: Sort by date, title, artist and album

export function TrackList(props: IProps) {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

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

    const filteredTracks = useMemo(
        () => filterTracks(props.tracks, debouncedSearch),
        [props.tracks, debouncedSearch]
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

    return (
        <>
            <ActionBar
                onPlayClicked={playTracks}
                search={search}
                setSearch={setSearch}
                debouncedSearch={debouncedSearch}
                setDebouncedSearch={setDebouncedSearch}
            />
            <TrackListGrid tracks={filteredTracks} onPlayTrack={playUri} />
        </>
    );
}
