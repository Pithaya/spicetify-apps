import React from 'react';
import { playContext, playTrack } from '../../../utils/player.utils';
import { PlayButton } from '@shared/components/ui/PlayButton';
import { MoreButton } from '../../shared/buttons/MoreButton';
import { getTranslation } from '@shared/utils/translations.utils';
import type {
    HeaderKey,
    LibraryHeaders,
    TrackListHeaderOption,
} from '@shared/components/track-list/models/sort-option';
import { TrackListGrid } from '@shared/components/track-list/TrackListGrid';
import { TrackListRowImageTitle } from '@shared/components/track-list/TrackListRowImageTitle';
import { TrackListRowAlbumLink } from '@shared/components/track-list/TrackListRowAlbumLink';
import type { Track } from 'custom-apps/better-local-files/src/models/track';
import type { Artist } from 'custom-apps/better-local-files/src/models/artist';
import { MultiTrackMenu } from '../../shared/menus/MultiTrackMenu';
import { navigateTo } from 'custom-apps/better-local-files/src/utils/history.utils';
import { ALBUM_ROUTE } from 'custom-apps/better-local-files/src/constants/constants';
import { RowMenu } from '../../shared/menus/RowMenu';

export type Props = {
    artist: Artist;
    tracks: Track[];
};

export function ArtistTrackList(props: Readonly<Props>): JSX.Element {
    const headers: TrackListHeaderOption<HeaderKey<LibraryHeaders>>[] = [
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
                                    props.tracks.map((t) => t.backingTrack),
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
                        props.tracks.map((t) => t.backingTrack),
                    );
                }}
                headers={headers}
                getRowContent={(track) => {
                    return [
                        <TrackListRowImageTitle
                            key={track.uri}
                            track={track}
                            withArtists={false}
                            onArtistClick={() => {}}
                        />,
                        <TrackListRowAlbumLink
                            key={track.uri}
                            track={track}
                            onAlbumClick={(albumUri) => {
                                navigateTo(ALBUM_ROUTE, albumUri);
                            }}
                        />,
                    ];
                }}
                displayType="list"
                getRowMenu={(track) => <RowMenu track={track} />}
            ></TrackListGrid>
        </>
    );
}
