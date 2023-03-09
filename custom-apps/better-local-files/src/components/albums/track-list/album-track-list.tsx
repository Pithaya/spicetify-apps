import styles from '../../../css/app.module.scss';
import React from 'react';
import { playContext, playTrack } from '../../../helpers/player-helpers';
import { PlayButton } from '../../shared/buttons/play-button';
import {
    SubTracksList,
    TrackListGrid,
} from '../../shared/track-list/track-list-grid';
import { TrackListRowTitle } from '../../shared/track-list/track-list-row-title';
import { TrackListHeaderOption } from 'custom-apps/better-local-files/src/models/track-list-header-option';
import { DiscDivider } from './disc-divider';
import { MoreButton } from '../../shared/buttons/more-button';
import { getTranslation } from 'custom-apps/better-local-files/src/helpers/translations-helper';
import { Track } from 'custom-apps/better-local-files/src/models/track';
import { MultiTrackMenu } from '../../shared/menus/multi-track-menu';

export interface IProps {
    albumName: string;
    discs: Map<number, Track[]>;
}

export function AlbumTrackList(props: IProps) {
    const tracks: Track[] = [];
    const subTracks: SubTracksList[] = [];

    const orderedTracks: Track[] = Array.from(props.discs.values()).flat();

    if (props.discs.size === 1) {
        // Only one disc
        tracks.push(...orderedTracks);
    } else {
        for (const [discNumber, tracks] of props.discs.entries()) {
            subTracks.push({
                headerRow: <DiscDivider discNumber={discNumber} />,
                tracks: tracks,
            });
        }
    }

    const headers: TrackListHeaderOption[] = [
        {
            key: 'title',
            label: getTranslation(['sort.title']),
        },
    ];

    return (
        <>
            <div className={`${styles['action-bar']}`}>
                <div
                    className={`${styles['flex-centered']} ${styles['action-bar-button-container']}`}
                >
                    <PlayButton
                        size={60}
                        iconSize={24}
                        onClick={() =>
                            playContext(orderedTracks.map((t) => t.localTrack))
                        }
                    />
                    <MoreButton
                        label={getTranslation(
                            ['more.label.context'],
                            orderedTracks[0].album.name
                        )}
                        menu={<MultiTrackMenu tracks={orderedTracks} />}
                    />
                </div>
            </div>

            <TrackListGrid
                tracks={tracks}
                subtracks={subTracks}
                gridLabel={props.albumName}
                useTrackNumber={true}
                onPlayTrack={(uri) =>
                    playTrack(
                        uri,
                        orderedTracks.map((t) => t.localTrack)
                    )
                }
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
