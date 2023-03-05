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
import { DiscDivider } from './disc-divider';

export interface IProps {
    tracks: LocalTrack[];
}

export function AlbumTrackList(props: IProps) {
    const tracks: LocalTrack[] = [];
    const disks: SubTracksList[] = [];

    const discNumbers = props.tracks.map((t) => t.discNumber);
    const firstDisc = Math.min(...discNumbers);
    const lastDisc = Math.max(...discNumbers);

    if (firstDisc === lastDisc) {
        tracks.push(
            ...props.tracks.sort((t1, t2) =>
                sort(t1.trackNumber, t2.trackNumber, 'ascending')
            )
        );
    } else {
        for (
            let i = Math.min(...discNumbers);
            i <= Math.max(...discNumbers);
            i++
        ) {
            disks.push({
                headerRow: <DiscDivider discNumber={i} />,
                tracks: props.tracks
                    .filter((t) => t.discNumber === i)
                    .sort((t1, t2) =>
                        sort(t1.trackNumber, t2.trackNumber, 'ascending')
                    ),
            });
        }
    }

    const orderedTracks =
        tracks.length > 0 ? tracks : disks.flatMap((d) => d.tracks);

    console.log(orderedTracks);

    const headers: TrackListHeaderOption[] = [
        {
            key: 'title',
            label: 'Titre',
        },
    ];

    // TODO: More option button in shared, open album menu
    // TODO: use tracknumber instead of index
    return (
        <>
            <div className={`${styles['action-bar']}`}>
                <div
                    className={`${styles['flex-centered']} ${styles['action-bar-button-container']}`}
                >
                    <PlayButton
                        size={60}
                        iconSize={24}
                        onClick={() => playContext(orderedTracks)}
                    />
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
                onPlayTrack={(uri) => playTrack(uri, orderedTracks)}
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
