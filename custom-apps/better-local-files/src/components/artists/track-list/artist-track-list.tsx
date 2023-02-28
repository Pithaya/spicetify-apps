import React, { useMemo, useState } from 'react';
import { LocalTrack } from '@shared';
import { playContext, playTrack } from '../../../helpers/player-helpers';
import { ArtistActionBar } from './artist-action-bar.component';
import { ArtistTrackListGrid } from './artist-track-list-grid';

export interface IProps {
    tracks: LocalTrack[];
}

export function ArtistTrackList(props: IProps) {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    function filterTracks(tracks: LocalTrack[], search: string) {
        if (search === '') {
            return tracks;
        }

        return tracks.filter((t) =>
            t.name.toLowerCase().includes(search.toLowerCase())
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
            <ArtistActionBar
                onPlayClicked={playTracks}
                search={search}
                setSearch={setSearch}
                debouncedSearch={debouncedSearch}
                setDebouncedSearch={setDebouncedSearch}
            />
            <ArtistTrackListGrid
                tracks={filteredTracks}
                onPlayTrack={playUri}
            />
        </>
    );
}
