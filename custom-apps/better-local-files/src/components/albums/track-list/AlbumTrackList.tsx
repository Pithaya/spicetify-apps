import React from 'react';
import { playContext, playTrack } from '../../../utils/player.utils';
import { PlayButton } from '../../shared/buttons/PlayButton';
import type { SubTracksList } from '../../shared/track-list/TrackListGrid';
import { TrackListGrid } from '../../shared/track-list/TrackListGrid';
import { TrackListRowTitle } from '../../shared/track-list/TrackListRowTitle';
import type { TrackListHeaderOption } from 'custom-apps/better-local-files/src/models/track-list-header-option';
import { DiscDivider } from './DiscDivider';
import { MoreButton } from '../../shared/buttons/MoreButton';
import { getTranslation } from 'custom-apps/better-local-files/src/utils/translations.utils';
import type { Track } from 'custom-apps/better-local-files/src/models/track';
import { MultiTrackMenu } from '../../shared/menus/MultiTrackMenu';

export type Props = {
    albumName: string;
    discs: Map<number, Track[]>;
};

export function AlbumTrackList(props: Readonly<Props>): JSX.Element {
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
                tracks,
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
            <div className="main-actionBar-ActionBar contentSpacing">
                <div className="main-actionBar-ActionBarRow">
                    <div className="main-playButton-PlayButton">
                        <PlayButton
                            size="lg"
                            onClick={() => {
                                playContext(
                                    orderedTracks.map((t) => t.localTrack),
                                );
                            }}
                        />
                    </div>

                    <MoreButton
                        label={getTranslation(
                            ['more.label.context'],
                            orderedTracks[0].album.name,
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
                onPlayTrack={(uri) => {
                    playTrack(
                        uri,
                        orderedTracks.map((t) => t.localTrack),
                    );
                }}
                headers={headers}
                getRowContent={(track) => {
                    return [
                        <TrackListRowTitle
                            key={track.uri}
                            track={track}
                            withArtists={true}
                        />,
                    ];
                }}
                displayType="list"
            ></TrackListGrid>
        </>
    );
}
