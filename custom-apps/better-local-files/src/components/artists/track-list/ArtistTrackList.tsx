import { MultiTrackMenu } from '@shared/components/menus/MultiTrackMenu';
import type {
    HeaderKey,
    LibraryHeaders,
    TrackListHeaderOption,
} from '@shared/components/track-list/models/sort-option';
import { TrackListGrid } from '@shared/components/track-list/TrackListGrid';
import { TrackListRowAlbumLink } from '@shared/components/track-list/TrackListRowAlbumLink';
import { TrackListRowImageTitle } from '@shared/components/track-list/TrackListRowImageTitle';
import { RowMenu } from '@shared/components/track-list/TrackListRowMenu';
import { PlayButton } from '@shared/components/ui/PlayButton';
import { getTranslation } from '@shared/utils/translations.utils';
import {
    ALBUM_ROUTE,
    ARTIST_ROUTE,
} from 'custom-apps/better-local-files/src/constants/constants';
import type { Artist } from 'custom-apps/better-local-files/src/models/artist';
import type { Track } from 'custom-apps/better-local-files/src/models/track';
import { navigateTo } from 'custom-apps/better-local-files/src/utils/history.utils';
import React from 'react';
import { playContext, playTrack } from '../../../utils/player.utils';
import { MoreButton } from '../../shared/buttons/MoreButton';

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
                                void playContext(
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
                    void playTrack(
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
                            onArtistClick={() => {
                                // No action needed, we are already on the artist page
                            }}
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
