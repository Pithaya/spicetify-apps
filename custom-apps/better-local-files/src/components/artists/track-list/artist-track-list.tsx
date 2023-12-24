import styles from '../../../css/app.module.scss';
import React from 'react';
import { playContext, playTrack } from '../../../helpers/player-helpers';
import { PlayButton } from '../../shared/buttons/play-button';
import { MoreButton } from '../../shared/buttons/more-button';
import { getTranslation } from 'custom-apps/better-local-files/src/helpers/translations-helper';
import type { TrackListHeaderOption } from 'custom-apps/better-local-files/src/models/track-list-header-option';
import { TrackListGrid } from '../../shared/track-list/track-list-grid';
import { TrackListRowImageTitle } from '../../shared/track-list/track-list-row-image-title';
import { TrackListRowAlbumLink } from '../../shared/track-list/track-list-row-album-link';
import type { Track } from 'custom-apps/better-local-files/src/models/track';
import type { Artist } from 'custom-apps/better-local-files/src/models/artist';
import { MultiTrackMenu } from '../../shared/menus/multi-track-menu';

export type Props = {
    artist: Artist;
    tracks: Track[];
};

// TODO: Compact display type

export function ArtistTrackList(props: Readonly<Props>): JSX.Element {
    const headers: TrackListHeaderOption[] = [
        {
            key: 'title',
            label: getTranslation(['sort.title']),
        },
        {
            key: 'album',
            label: getTranslation(['sort.album']),
        },
    ];

    return (
        <>
            <div className="main-actionBar-ActionBar contentSpacing">
                <div className="main-actionBar-ActionBarRow">
                    <div className="main-playButton-PlayButton">
                        <PlayButton
                            size="lg"
                            onClick={() => {
                                playContext(
                                    props.tracks.map((t) => t.localTrack),
                                );
                            }}
                        />
                    </div>

                    <MoreButton
                        label={getTranslation(
                            ['more.label.context'],
                            props.artist.name,
                        )}
                        menu={<MultiTrackMenu tracks={props.tracks} />}
                    />
                </div>
            </div>

            <TrackListGrid
                tracks={props.tracks}
                subtracks={[]}
                gridLabel={props.artist.name}
                useTrackNumber={false}
                onPlayTrack={(uri) => {
                    playTrack(
                        uri,
                        props.tracks.map((t) => t.localTrack),
                    );
                }}
                headers={headers}
                getRowContent={(track) => {
                    return [
                        <TrackListRowImageTitle
                            key={track.uri}
                            track={track}
                            withArtists={false}
                        />,
                        <TrackListRowAlbumLink key={track.uri} track={track} />,
                    ];
                }}
                displayType="list"
            ></TrackListGrid>
        </>
    );
}
