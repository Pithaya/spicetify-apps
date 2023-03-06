import styles from '../../../css/app.module.scss';
import React from 'react';
import { LocalTrack } from '@shared';
import { playContext, playTrack } from '../../../helpers/player-helpers';
import { PlayButton } from '../../shared/buttons/play-button';
import { MoreButton } from '../../shared/buttons/more-button';
import { getTranslation } from 'custom-apps/better-local-files/src/helpers/translations-helper';
import { TrackListHeaderOption } from 'custom-apps/better-local-files/src/models/track-list-header-option';
import { sort } from 'custom-apps/better-local-files/src/helpers/sort-helper';
import { TrackListGrid } from '../../shared/track-list/track-list-grid';
import { TrackListRowImageTitle } from '../../shared/track-list/track-list-row-image-title';
import { TrackListRowAlbumLink } from '../../shared/track-list/track-list-row-album-link';
import { RowMenu } from '../../tracks/menus/row-menu';

export interface IProps {
    tracks: LocalTrack[];
}

export function ArtistTrackList(props: IProps) {
    const headers: TrackListHeaderOption[] = [
        {
            key: 'title',
            label: 'Titre',
        },
        {
            key: 'album',
            label: 'Album',
        },
    ];

    const orderedTracks = props.tracks.sort(
        (t1, t2) =>
            sort(t1.album.name, t2.album.name, 'ascending') ||
            sort(t1.discNumber, t2.discNumber, 'ascending')
    );

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
                        menu={<RowMenu track={orderedTracks[0]} />}
                    />
                </div>
            </div>

            <TrackListGrid
                tracks={orderedTracks}
                subtracks={[]}
                gridLabel="Local tracks"
                onPlayTrack={(uri) => playTrack(uri, orderedTracks)}
                headers={headers}
                getRowContent={(track) => {
                    return [
                        <TrackListRowImageTitle
                            track={track}
                            withArtists={false}
                        />,
                        <TrackListRowAlbumLink track={track} />,
                    ];
                }}
            ></TrackListGrid>
        </>
    );
}
