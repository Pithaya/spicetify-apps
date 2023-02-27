import styles from './css/app.module.scss';
import React, { useState } from 'react';
import { LocalTrack } from '@shared';
import { ActionBar } from '../action-bar.component';
import { TrackList } from './track-list';

export interface IProps {
    tracks: LocalTrack[];
}

export function TrackListContainer(props: IProps) {
    const [filteredTracks, setFilteredTracks] = useState(props.tracks);

    return (
        <>
            <ActionBar tracks={filteredTracks} />
            <TrackList tracks={filteredTracks} />
        </>
    );
}
