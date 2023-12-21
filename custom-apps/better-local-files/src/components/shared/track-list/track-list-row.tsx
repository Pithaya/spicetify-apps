import { getTranslation } from 'custom-apps/better-local-files/src/helpers/translations-helper';
import type { Track } from 'custom-apps/better-local-files/src/models/track';
import React, {
    Children,
    type MouseEventHandler,
    type PropsWithChildren,
    useRef,
} from 'react';
import { useIntersectionObserver } from '../../../hooks/use-intersection-observer';
import { RowMenu } from '../menus/row-menu';

export type Props = {
    track: Track;
    index: number;
    selected: boolean;
    active: boolean;
    playing: boolean;
    onClick: MouseEventHandler<HTMLDivElement>;
    onDoubleClick: () => void;
    dragHandler: (
        event: React.DragEvent,
        uris?: string[],
        label?: string,
        contextUri?: string,
        sectionIndex?: number,
    ) => void;
};

export function TrackListRow(props: PropsWithChildren<Props>): JSX.Element {
    const rowRef = useRef<HTMLDivElement>(null);
    const visible = useIntersectionObserver(rowRef);

    const placeholder = <div style={{ height: '54px' }}></div>;

    // TODO: Set the correct aria-rowindex

    return (
        <div ref={rowRef}>
            {visible ? (
                <Spicetify.ReactComponent.RightClickMenu
                    menu={<RowMenu track={props.track} />}
                >
                    <div
                        aria-selected={props.selected}
                        onClick={props.onClick}
                        onDoubleClick={props.onDoubleClick}
                        draggable="true"
                        onDragStart={props.dragHandler}
                    >
                        <div
                            className={`main-trackList-trackListRow main-trackList-trackListRowGrid ${
                                props.active ? 'main-trackList-active' : ''
                            } ${
                                props.selected ? 'main-trackList-selected' : ''
                            }`}
                            draggable="false"
                            role="presentation"
                        >
                            <div
                                className="main-trackList-rowSectionIndex"
                                aria-colindex={1}
                                tabIndex={-1}
                            >
                                <div className="main-trackList-rowMarker">
                                    {!props.playing ? (
                                        <>
                                            <span className="main-trackList-number">
                                                {props.index}
                                            </span>

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
                                                        } else {
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
                                        </>
                                    ) : (
                                        <>
                                            <img
                                                className="main-trackList-playingIcon"
                                                width="14"
                                                height="14"
                                                alt=""
                                                src="/images/equaliser-animated-green.gif"
                                            />
                                            <Spicetify.ReactComponent.TooltipWrapper
                                                label={getTranslation([
                                                    'playback-control.pause',
                                                ])}
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
                                    )}
                                </div>
                            </div>

                            {props.children &&
                                Children.map(props.children, (child, index) => {
                                    return (
                                        <div
                                            className={
                                                index === 0
                                                    ? 'main-trackList-rowSectionStart'
                                                    : 'main-trackList-rowSectionVariable'
                                            }
                                            aria-colindex={index + 2}
                                            tabIndex={-1}
                                        >
                                            {child}
                                        </div>
                                    );
                                })}

                            <div
                                className="main-trackList-rowSectionEnd"
                                aria-colindex={
                                    Children.count(props.children) + 2
                                }
                                tabIndex={-1}
                            >
                                <div className="main-trackList-rowDuration">
                                    {Spicetify.Player.formatTime(
                                        props.track.duration,
                                    )}
                                </div>

                                <Spicetify.ReactComponent.ContextMenu
                                    trigger="click"
                                    action="toggle"
                                    menu={<RowMenu track={props.track} />}
                                >
                                    <Spicetify.ReactComponent.ButtonTertiary
                                        aria-label={getTranslation(
                                            ['more.label.track'],
                                            props.track.name,
                                            props.track.artists
                                                .map((a) => a.name)
                                                .join(', '),
                                        )}
                                        aria-haspopup="menu"
                                        iconOnly={() => (
                                            <svg
                                                height="16"
                                                width="16"
                                                aria-hidden="true"
                                                viewBox="0 0 16 16"
                                                fill="currentColor"
                                            >
                                                <path d="M3 8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm6.5 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM16 8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path>
                                            </svg>
                                        )}
                                    ></Spicetify.ReactComponent.ButtonTertiary>
                                </Spicetify.ReactComponent.ContextMenu>
                            </div>
                        </div>
                    </div>
                </Spicetify.ReactComponent.RightClickMenu>
            ) : (
                placeholder
            )}
        </div>
    );
}
