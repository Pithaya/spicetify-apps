import { getTranslation } from '@shared/utils/translations.utils';
import React from 'react';
import type { ITrack } from './models/interfaces';

export type Props = {
    track: ITrack;
    index: number;
    selected: boolean;
    active: boolean;
    playing: boolean;
    onDoubleClick: () => void;
};

export function TrackListRowMarker(props: Readonly<Props>): JSX.Element {
    return (
        <div className="main-trackList-rowMarker">
            {props.playing ? (
                <>
                    <img
                        className="main-trackList-playingIcon"
                        width="14"
                        height="14"
                        alt=""
                        src="/images/equaliser-animated-green.gif"
                    />
                    <Spicetify.ReactComponent.TooltipWrapper
                        label={getTranslation(['playback-control.pause'])}
                        showDelay={200}
                    >
                        <button
                            className="main-trackList-rowImagePlayButton"
                            aria-label={getTranslation([
                                'playback-control.pause',
                            ])}
                            tabIndex={0}
                            aria-expanded="false"
                            onClick={() => {
                                Spicetify.Player.pause();
                            }}
                        >
                            <svg
                                height="24"
                                width="24"
                                aria-hidden="true"
                                fill="currentColor"
                                className="main-trackList-rowPlayPauseIcon"
                                viewBox="0 0 24 24"
                            >
                                <path d="M5.7 3a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7H5.7zm10 0a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7h-2.6z"></path>
                            </svg>
                        </button>
                    </Spicetify.ReactComponent.TooltipWrapper>
                </>
            ) : (
                <>
                    <span className="main-trackList-number">{props.index}</span>

                    {props.track.isPlayable && (
                        <Spicetify.ReactComponent.TooltipWrapper
                            label={getTranslation(
                                ['tracklist.a11y.play'],
                                props.track.name,
                                props.track.artists
                                    .map((a) => a.name)
                                    .join(', '),
                            )}
                            showDelay={200}
                        >
                            <button
                                className="main-trackList-rowImagePlayButton"
                                aria-label={getTranslation(
                                    ['tracklist.a11y.play'],
                                    props.track.name,
                                    props.track.artists
                                        .map((a) => a.name)
                                        .join(', '),
                                )}
                                onClick={() => {
                                    if (props.active) {
                                        Spicetify.Player.play();
                                    } else if (props.track.isPlayable) {
                                        props.onDoubleClick();
                                    }
                                }}
                                tabIndex={-1}
                            >
                                <svg
                                    height="24"
                                    width="24"
                                    aria-hidden="true"
                                    className="main-trackList-rowPlayPauseIcon"
                                    viewBox="0 0 24 24"
                                    data-encore-id="icon"
                                    fill="currentColor"
                                >
                                    <path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z"></path>
                                </svg>
                            </button>
                        </Spicetify.ReactComponent.TooltipWrapper>
                    )}
                </>
            )}
        </div>
    );
}
