import { MultiTrackMenu } from '@shared/components/menus/MultiTrackMenu';
import type { SubTracksList } from '@shared/components/track-list/TrackListGrid';
import { TrackListGrid } from '@shared/components/track-list/TrackListGrid';
import { RowMenu } from '@shared/components/track-list/TrackListRowMenu';
import { TrackListRowTitle } from '@shared/components/track-list/TrackListRowTitle';
import type {
    HeaderKey,
    LibraryHeaders,
    TrackListHeaderOption,
} from '@shared/components/track-list/models/sort-option';
import { PlayButton } from '@shared/components/ui/PlayButton';
import { getTranslation } from '@shared/utils/translations.utils';
import {
    ALBUM_ROUTE,
    ARTIST_ROUTE,
} from 'custom-apps/better-local-files/src/constants/constants';
import type { Track } from 'custom-apps/better-local-files/src/models/track';
import { navigateTo } from 'custom-apps/better-local-files/src/utils/history.utils';
import React from 'react';
import { playContext, playTrack } from '../../../utils/player.utils';
import { MoreButton } from '../../shared/buttons/MoreButton';
import { DiscDivider } from './DiscDivider';

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
        const sortedDiscEntries = Array.from(props.discs.entries()).toSorted(
            ([discNumberA], [discNumberB]) => discNumberA - discNumberB,
        );

        for (const [discNumber, tracks] of sortedDiscEntries) {
            subTracks.push({
                headerRow: <DiscDivider discNumber={discNumber} />,
                tracks,
            });
        }
    }

    const headers: TrackListHeaderOption<HeaderKey<LibraryHeaders>>[] = [
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
                                void playContext(
                                    orderedTracks.map((t) => t.backingTrack),
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
                    void playTrack(
                        uri,
                        orderedTracks.map((t) => t.backingTrack),
                    );
                }}
                headers={headers}
                getRowContent={(track) => {
                    return [
                        <TrackListRowTitle
                            key={track.uri}
                            track={track}
                            withArtists={true}
                            onArtistClick={(artistUri) => {
                                navigateTo(ARTIST_ROUTE, artistUri);
                            }}
                        />,
                    ];
                }}
                displayType="list"
                getRowMenu={(track) => (
                    <RowMenu
                        track={track}
                        onArtistClick={(uri) => {
                            navigateTo(ARTIST_ROUTE, uri);
                        }}
                        onAlbumClick={(uri) => {
                            navigateTo(ALBUM_ROUTE, uri);
                        }}
                    />
                )}
            ></TrackListGrid>
        </>
    );
}
