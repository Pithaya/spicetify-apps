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
import { getPlatform } from '@shared/utils/spicetify-utils';
import {
    getTranslatedDuration,
    getTranslation,
} from '@shared/utils/translations.utils';
import { getId } from '@shared/utils/uri-utils';
import { ArrowRightFromLine } from 'lucide-react';
import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import useAppStore from '../../stores/store';
import { CreatePlaylistModal } from './modals/CreatePlaylistModal';
import styles from './ResultPage.module.scss';

export function ResultPage(): JSX.Element {
    const history = getPlatform().History;

    const { result } = useAppStore(
        useShallow((state) => ({
            result: state.result,
        })),
    );

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

        await getPlatform().PlayerAPI.play(
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
        <div id="playlist-maker" className="app-container">
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
                                    disabled={result.length === 0}
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
                                    disabled={result.length === 0}
                                    aria-label="Create playlist from tracks"
                                    iconOnly={() => (
                                        <ArrowRightFromLine size={30} />
                                    )}
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
                            {result.length > 0 && (
                                <p>
                                    {getTranslation(
                                        [
                                            'tracklist-header.songs-counter',
                                            result.length === 1
                                                ? 'one'
                                                : 'other',
                                        ],
                                        result.length.toFixed(),
                                    )}
                                    <span className="main-entityHeader-divider"></span>
                                    {getTranslatedDuration(
                                        result.reduce(
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
                        tracks={result.map((track) => ({
                            ...track,
                            addedAt: null,
                            trackNumber: 0,
                        }))}
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
                                    const historyApi = getPlatform().History;
                                    const artistUri =
                                        Spicetify.URI.fromString(uri);
                                    const artistUrl = artistUri.toURLPath(true);
                                    historyApi.push(artistUrl);
                                }}
                                onAlbumClick={(uri) => {
                                    const historyApi = getPlatform().History;
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
