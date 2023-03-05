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
import { MoreButton } from '../../shared/buttons/more-button';
import { getTranslation } from 'custom-apps/better-local-files/src/helpers/translations-helper';
import { AlbumRowMenu } from '../menus/album-row-menu';

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

    // TODO: Use the correct more option album menu
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
                    <MoreButton
                        label={getTranslation(
                            ['more.label.context'],
                            orderedTracks[0].album.name
                        )}
                        menu={<AlbumRowMenu track={orderedTracks[0]} />}
                    />
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
