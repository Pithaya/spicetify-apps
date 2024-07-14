import React, { useMemo } from 'react';
import styles from './ResultPage.module.scss';
import useAppStore from '../../store/store';
import { useShallow } from 'zustand/react/shallow';
import type {
    LibraryHeaders,
    TrackListHeaderOption,
} from '@shared/components/track-list/models/sort-option';
import { getTranslation } from '@shared/utils/translations.utils';
import { PlayButton } from '@shared/components/ui/PlayButton';
import { TrackListGrid } from '@shared/components/track-list/TrackListGrid';
import { TrackListRowImageTitle } from '@shared/components/track-list/TrackListRowImageTitle';
import { TrackListRowAlbumLink } from '@shared/components/track-list/TrackListRowAlbumLink';
import { TrackWrapper } from '../../models/track-wrapper';
import { getPlatformApiOrThrow } from '@shared/utils/spicetify-utils';
import type { History } from '@shared/platform/history';
import { getId } from '@shared/utils/uri-utils';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';

export function ResultPage(): JSX.Element {
    const history = getPlatformApiOrThrow<History>('History');

    const { result } = useAppStore(
        useShallow((state) => ({
            result: state.result,
        })),
    );

    const tracks = useMemo(() => {
        return result.map((track) => new TrackWrapper(track));
    }, [result]);

    const headers: TrackListHeaderOption<LibraryHeaders | 'source'>[] = [
        {
            key: 'title',
            label: getTranslation(['tracklist.header.title']),
        },
        {
            key: 'album',
            label: getTranslation(['tracklist.header.album']),
        },
        {
            key: 'source',
            label: 'Source', // TODO: Translation
        },
    ];

    const playTracks = (trackUri?: string): void => {
        const skip = trackUri
            ? {
                  uri: trackUri,
              }
            : undefined;

        // TODO: Use playerAPI
        (Spicetify.Player as any).origin.play(
            {
                uri: '',
                pages: [{ items: result }],
            },
            {},
            {
                skipTo: skip,
            },
        );
    };

    return (
        <div className={styles['container']}>
            <div className={styles['grid-container']}>
                <div className={styles['padding']} />
                <div className={styles['main']}>
                    <div className="main-actionBar-ActionBar contentSpacing">
                        <div className="main-actionBar-ActionBarRow">
                            <div className="main-playButton-PlayButton">
                                <PlayButton
                                    size="lg"
                                    onClick={() => {
                                        playTracks();
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <TrackListGrid
                        tracks={tracks}
                        subtracks={[]}
                        gridLabel={getTranslation(['local-files'])}
                        useTrackNumber={false}
                        onPlayTrack={(uri) => {
                            playTracks(uri);
                        }}
                        headers={headers}
                        getRowContent={(track) => {
                            const contents = [
                                <TrackListRowImageTitle
                                    track={track}
                                    withArtists={true}
                                    key={track.uri}
                                    onArtistClick={(artistUri) => {
                                        history.push(
                                            `/artist/${getId(
                                                Spicetify.URI.fromString(
                                                    artistUri,
                                                ),
                                            )}`,
                                        );
                                    }}
                                />,
                                <TrackListRowAlbumLink
                                    track={track}
                                    key={track.uri}
                                    onAlbumClick={(albumUri) => {
                                        history.push(
                                            `/album/${getId(
                                                Spicetify.URI.fromString(
                                                    albumUri,
                                                ),
                                            )}`,
                                        );
                                    }}
                                />,
                                <TextComponent
                                    key={track.uri}
                                    variant="mesto"
                                    className="standalone-ellipsis-one-line"
                                >
                                    {track.source}
                                </TextComponent>,
                            ];

                            return contents;
                        }}
                        displayType={'list'}
                        getRowMenu={(track) => (
                            <Spicetify.ReactComponent.TrackMenu
                                uri={track.uri}
                                artists={track.artists}
                                albumUri={track.album.uri}
                            />
                        )}
                    />
                </div>
            </div>
        </div>
    );
}
