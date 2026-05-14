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
import type { CachedTrack } from 'custom-apps/better-local-files/src/models/cached-track';
import { navigateTo } from 'custom-apps/better-local-files/src/utils/history.utils';
import React from 'react';
import { playContext, playTrack } from '../../../utils/player.utils';
import { MoreButton } from '../../shared/buttons/MoreButton';
import { DiscDivider } from './DiscDivider';

export type Props = {
    albumName: string;
    discs: Map<number, CachedTrack[]>;
};

export function AlbumTrackList(props: Readonly<Props>): JSX.Element {
    const tracks: CachedTrack[] = [];
    const subTracks: SubTracksList[] = [];

    const orderedTracks: CachedTrack[] = Array.from(
        props.discs.values(),
    ).flat();

    const trackUris = orderedTracks.map((t) => t.uri);

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
                                void playContext(trackUris);
                            }}
                        />
                    </div>

                    <MoreButton
                        label={getTranslation(
                            ['more.label.context'],
                            props.albumName,
                        )}
                        menu={<MultiTrackMenu tracksUri={trackUris} />}
                    />
                </div>
            </div>

            <TrackListGrid
                tracks={tracks}
                subtracks={subTracks}
                gridLabel={props.albumName}
                useTrackNumber={true}
                onPlayTrack={(uri) => {
                    void playTrack(uri, trackUris);
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
