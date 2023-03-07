import { Locale } from '@shared';
import { Track } from 'custom-apps/better-local-files/src/models/track';
import React, { Children, PropsWithChildren, useRef } from 'react';
import { useIntersectionObserver } from '../../../hooks/use-intersection-observer';
import { RowMenu } from '../menus/row-menu';

const locale: Locale = (Spicetify as any).Locale;

export interface IProps {
    track: Track;
    index: number;
    selected: boolean;
    active: boolean;
    onClick: () => void;
    onDoubleClick: () => void;
}

export function TrackListRow(props: PropsWithChildren<IProps>) {
    const rowRef = useRef<HTMLDivElement>(null);
    const visible = useIntersectionObserver(rowRef);

    const placeholder = <div style={{ height: '54px' }}></div>;

    return (
        <div ref={rowRef}>
            {visible ? (
                <Spicetify.ReactComponent.RightClickMenu
                    menu={<RowMenu track={props.track} />}
                >
                    <div
                        role="row"
                        aria-rowindex={props.index + 2}
                        aria-selected={props.selected}
                        onClick={props.onClick}
                        onDoubleClick={props.onDoubleClick}
                    >
                        <div
                            className={`main-trackList-trackListRow main-trackList-trackListRowGrid ${
                                props.active ? 'main-trackList-active' : ''
                            } ${
                                props.selected ? 'main-trackList-selected' : ''
                            }`}
                            draggable="true"
                            role="presentation"
                        >
                            <div
                                className="main-trackList-rowSectionIndex"
                                role="gridcell"
                                aria-colindex={1}
                                tabIndex={-1}
                            >
                                <div className="main-trackList-rowMarker">
                                    <span className="main-trackList-number">
                                        {props.index + 1}
                                    </span>
                                    <button
                                        className="main-trackList-rowImagePlayButton"
                                        aria-label="Lire X par X" // TODO: i18n
                                        // TODO: On click: play
                                        tabIndex={-1}
                                    >
                                        <svg
                                            role="img"
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
                                            role="gridcell"
                                            aria-colindex={index + 2}
                                            tabIndex={-1}
                                        >
                                            {child}
                                        </div>
                                    );
                                })}

                            <div
                                className="main-trackList-rowSectionEnd"
                                role="gridcell"
                                aria-colindex={
                                    Children.count(props.children) + 2
                                }
                                tabIndex={-1}
                            >
                                <div className="main-trackList-rowDuration">
                                    {Spicetify.Player.formatTime(
                                        props.track.duration
                                    )}
                                </div>
                                <button
                                    type="button"
                                    aria-haspopup="menu"
                                    aria-label="Plus d'options pour Infestation par DM DOKURO" // TODO: i18n
                                    className="main-moreButton-button main-trackList-rowMoreButton"
                                    tabIndex={-1}
                                >
                                    <svg
                                        role="img"
                                        height="16"
                                        width="16"
                                        aria-hidden="true"
                                        viewBox="0 0 16 16"
                                        data-encore-id="icon"
                                        fill="currentColor"
                                    >
                                        <path d="M3 8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm6.5 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM16 8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path>
                                    </svg>
                                </button>
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
