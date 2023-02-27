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

export function TrackList(props: IProps) {
    const [onSearchSubject] = useState<Subject<string>>(new Subject<string>());
    const [search, setSearch] = useState('');
    const [debounceSearch, setDebounceSearch] = useState('');

    useEffect(() => {
        const subscription = onSearchSubject
            .asObservable()
            .pipe(debounceTime(600), distinctUntilChanged())
            .subscribe((debounced) => setDebounceSearch(debounced));

        return () => subscription.unsubscribe();
    }, [onSearchSubject]);

    function onSearchChange(value: string) {
        onSearchSubject.next(value);
        setSearch(value);
    }

    function filterTracks(tracks: LocalTrack[], search: string) {
        if (search === '') {
            return tracks;
        }

        return tracks.filter((t) => t.name.includes(search));
    }

    const filteredTracks = useMemo(
        () => filterTracks(props.tracks, debounceSearch),
        [props.tracks, debounceSearch]
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
                searchText={search}
                onSearchChanged={onSearchChange}
            />
            <TrackListGrid tracks={filteredTracks} onPlayTrack={playUri} />
        </>
    );
}
