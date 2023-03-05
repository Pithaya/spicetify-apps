import styles from '../../../css/app.module.scss';
import React from 'react';
import { LocalTrack } from '@shared';
import { playContext, playTrack } from '../../../helpers/player-helpers';
import { PlayButton } from '../../shared/buttons/play-button';
import {
    SubTracksList,
    TrackListGrid,
} from '../../shared/track-list/track-list-grid';
import { TrackListRowTitle } from '../../shared/track-list/track-list-row-title';
import { TrackListHeaderOption } from 'custom-apps/better-local-files/src/models/track-list-header-option';
import { sort } from 'custom-apps/better-local-files/src/helpers/sort-helper';

export interface IProps {
    tracks: LocalTrack[];
}

export function AlbumTrackList(props: IProps) {
    function playUri(uri: string) {
        playTrack(uri, props.tracks);
    }

    function playTracks() {
        if (props.tracks.length === 0) {
            return;
        }

        playContext(props.tracks);
    }

    const tracks: LocalTrack[] = [];
    const disks: SubTracksList[] = [];

    const discNumbers = props.tracks.map((t) => t.discNumber);
    const firstDisc = Math.min(...discNumbers);
    const lastDisc = Math.max(...discNumbers);

    if (firstDisc === lastDisc) {
        tracks.push(...props.tracks);
    } else {
        for (
            let i = Math.min(...discNumbers);
            i <= Math.max(...discNumbers);
            i++
        ) {
            disks.push({
                headerRow: (
                    <div
                        className="main-trackList-trackListRowGrid main-trackList-discRow"
                        role="presentation"
                    >
                        <div
                            className="main-trackList-rowSectionIndex"
                            role="gridcell"
                            aria-colindex={1}
                            tabIndex={-1}
                        >
                            <div className="main-trackList-rowMarker">
                                <span className="main-trackList-icon">
                                    <svg
                                        role="img"
                                        height="16"
                                        width="16"
                                        aria-hidden="true"
                                        viewBox="0 0 16 16"
                                        fill="currentColor"
                                    >
                                        <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"></path>
                                        <path d="M8 6.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM5 8a3 3 0 1 1 6 0 3 3 0 0 1-6 0z"></path>
                                    </svg>
                                </span>
                            </div>
                        </div>
                        <div
                            className="main-trackList-rowSectionStart"
                            role="gridcell"
                            aria-colindex={2}
                            tabIndex={-1}
                        >
                            <div className="main-trackList-rowMainContent">
                                <div
                                    dir="auto"
                                    className="main-trackList-rowTitle main-trackList-discTitle standalone-ellipsis-one-line"
                                >
                                    Disque&nbsp;{i}
                                </div>
                            </div>
                        </div>
                    </div>
                ),
                tracks: props.tracks
                    .filter((t) => t.discNumber === i)
                    .sort((t1, t2) =>
                        sort(t1.trackNumber, t2.trackNumber, 'ascending')
                    ),
            });
        }
    }

    console.log(disks);

    const headers: TrackListHeaderOption[] = [
        {
            key: 'title',
            label: 'Titre',
        },
    ];

    // TODO: More option button in shared, open album menu
    return (
        <>
            <div className={`${styles['action-bar']}`}>
                <div
                    className={`${styles['flex-centered']} ${styles['action-bar-button-container']}`}
                >
                    <PlayButton size={60} iconSize={24} onClick={playTracks} />
                    <button
                        type="button"
                        aria-haspopup="menu"
                        aria-label="Plus d'options pour Catherine &amp; Catherine Full Body Soundtrack Set"
                        className="main-moreButton-button"
                        aria-expanded="false"
                    >
                        <svg
                            role="img"
                            height="32"
                            width="32"
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            data-encore-id="icon"
                            fill="currentColor"
                        >
                            <path d="M4.5 13.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm15 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm-7.5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                        </svg>
                    </button>
                </div>
            </div>

            <TrackListGrid
                tracks={tracks}
                subtracks={disks}
                gridLabel="Local tracks"
                onPlayTrack={playUri}
                headers={headers}
                getRowContent={(track) => {
                    return [
                        <TrackListRowTitle track={track} withArtists={true} />,
                    ];
                }}
            ></TrackListGrid>
        </>
    );
}
