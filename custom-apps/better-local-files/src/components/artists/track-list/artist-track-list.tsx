import styles from '../../../css/app.module.scss';
import React from 'react';
import { playContext, playTrack } from '../../../helpers/player-helpers';
import { PlayButton } from '../../shared/buttons/play-button';
import { MoreButton } from '../../shared/buttons/more-button';
import { getTranslation } from 'custom-apps/better-local-files/src/helpers/translations-helper';
import { TrackListHeaderOption } from 'custom-apps/better-local-files/src/models/track-list-header-option';
import { TrackListGrid } from '../../shared/track-list/track-list-grid';
import { TrackListRowImageTitle } from '../../shared/track-list/track-list-row-image-title';
import { TrackListRowAlbumLink } from '../../shared/track-list/track-list-row-album-link';
import { Track } from 'custom-apps/better-local-files/src/models/track';
import { Artist } from 'custom-apps/better-local-files/src/models/artist';
import { MultiTrackMenu } from '../../shared/menus/multi-track-menu';

export interface IProps {
    artist: Artist;
    tracks: Track[];
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
                            playContext(props.tracks.map((t) => t.localTrack))
                        }
                    />
                    <MoreButton
                        label={getTranslation(
                            ['more.label.context'],
                            props.artist.name
                        )}
                        menu={<MultiTrackMenu tracks={props.tracks} />}
                    />
                </div>
            </div>

            <TrackListGrid
                tracks={props.tracks}
                subtracks={[]}
                gridLabel={props.artist.name}
                onPlayTrack={(uri) =>
                    playTrack(
                        uri,
                        props.tracks.map((t) => t.localTrack)
                    )
                }
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
