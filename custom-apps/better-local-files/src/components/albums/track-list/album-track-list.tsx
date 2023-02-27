import React, { useMemo, useState } from 'react';
import { LocalTrack } from '@shared';
import { AlbumActionBar } from './album-action-bar.component';
import { AlbumTrackListGrid } from './album-track-list-grid';
import { playContext, playTrack } from '../../../helpers/player-helpers';

export interface IProps {
    tracks: LocalTrack[];
}

export function AlbumTrackList(props: IProps) {
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
            <AlbumActionBar
                onPlayClicked={playTracks}
                search={search}
                setSearch={setSearch}
                debouncedSearch={debouncedSearch}
                setDebouncedSearch={setDebouncedSearch}
            />
            <AlbumTrackListGrid tracks={filteredTracks} onPlayTrack={playUri} />
        </>
    );
}
