import type {
    LibraryHeaders,
    TrackListHeaderOption,
} from '@shared/components/track-list/models/sort-option';
import { TrackListGrid } from '@shared/components/track-list/TrackListGrid';
import { TrackListRowAlbumLink } from '@shared/components/track-list/TrackListRowAlbumLink';
import { TrackListRowImageTitle } from '@shared/components/track-list/TrackListRowImageTitle';
import { RowMenu } from '@shared/components/track-list/TrackListRowMenu';
import { PlayButton } from '@shared/components/ui/PlayButton';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { type History } from '@shared/platform/history';
import { type PlayerAPI } from '@shared/platform/player';
import { getPlatformApiOrThrow } from '@shared/utils/spicetify-utils';
import {
    getTranslatedDuration,
    getTranslation,
} from '@shared/utils/translations.utils';
import { getId } from '@shared/utils/uri-utils';
import { ArrowRightFromLine } from 'lucide-react';
import React, { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { TrackWrapper } from '../../models/track-wrapper';
import useAppStore from '../../stores/store';
import { CreatePlaylistModal } from './modals/CreatePlaylistModal';
import styles from './ResultPage.module.scss';

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

    const playTracks = async (trackUri?: string): Promise<void> => {
        const skip = trackUri
            ? {
                  uri: trackUri,
              }
            : undefined;

        const playerApi = getPlatformApiOrThrow<PlayerAPI>('PlayerAPI');
        await playerApi.play(
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
        <div className="app-container">
            <div
                className={Spicetify.classnames(
                    styles['grid-container'],
                    'gap-panel h-full w-full',
                )}
            >
                <div
                    className={Spicetify.classnames(styles['padding'], 'panel')}
                />
                <div className={Spicetify.classnames(styles['main'], 'panel')}>
                    <div className="main-actionBar-ActionBar contentSpacing">
                        <div className="main-actionBar-ActionBarRow">
                            <div className="main-playButton-PlayButton">
                                <PlayButton
                                    disabled={tracks.length === 0}
                                    size="lg"
                                    onClick={() => {
                                        void playTracks();
                                    }}
                                />
                            </div>
                            <Spicetify.ReactComponent.TooltipWrapper
                                label={'Create playlist from tracks'}
                            >
                                <Spicetify.ReactComponent.ButtonSecondary
                                    disabled={tracks.length === 0}
                                    aria-label="Create playlist from tracks"
                                    iconOnly={<ArrowRightFromLine size={30} />}
                                    buttonSize="lg"
                                    onClick={() => {
                                        Spicetify.PopupModal.display({
                                            title: 'Create playlist',
                                            content: <CreatePlaylistModal />,
                                            isLarge: true,
                                        });
                                    }}
                                    className={styles['help-button']}
                                ></Spicetify.ReactComponent.ButtonSecondary>
                            </Spicetify.ReactComponent.TooltipWrapper>
                            {tracks.length > 0 && (
                                <p>
                                    {getTranslation(
                                        [
                                            'tracklist-header.songs-counter',
                                            tracks.length === 1
                                                ? 'one'
                                                : 'other',
                                        ],
                                        tracks.length,
                                    )}
                                    <span className="main-entityHeader-divider"></span>
                                    {getTranslatedDuration(
                                        tracks.reduce(
                                            (acc, track) =>
                                                acc + track.duration,
                                            0,
                                        ),
                                    )}
                                </p>
                            )}
                        </div>
                    </div>

                    <TrackListGrid
                        tracks={tracks}
                        subtracks={[]}
                        gridLabel={getTranslation(['local-files'])}
                        useTrackNumber={false}
                        onPlayTrack={(uri) => {
                            void playTracks(uri);
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
                            <RowMenu
                                track={track}
                                onArtistClick={(uri) => {
                                    const historyApi =
                                        getPlatformApiOrThrow<History>(
                                            'History',
                                        );
                                    const artistUri =
                                        Spicetify.URI.fromString(uri);
                                    const artistUrl = artistUri.toURLPath(true);
                                    historyApi.push(artistUrl);
                                }}
                                onAlbumClick={(uri) => {
                                    const historyApi =
                                        getPlatformApiOrThrow<History>(
                                            'History',
                                        );
                                    const albumUri =
                                        Spicetify.URI.fromString(uri);
                                    const albumUrl = albumUri.toURLPath(true);
                                    historyApi.push(albumUrl);
                                }}
                            />
                        )}
                    />
                </div>
            </div>
        </div>
    );
}
