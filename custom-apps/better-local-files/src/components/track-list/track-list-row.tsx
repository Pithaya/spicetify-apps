import { Locale, LocalTrack } from '@shared';
import React, { useState } from 'react';
import { RowMenu } from '../menus/row-menu';

const locale: Locale = (Spicetify as any).Locale;

export interface IProps {
    track: LocalTrack;
    index: number;
}

export function TrackListRow(props: IProps) {
    const [active, setActive] = useState(false);
    const [selected, setSelected] = useState(false);

    function play() {
        /*
        Spicetify.Player.playUri({
            pages: [ {items: props.track }]
        });*/
    }

    return (
        <Spicetify.ReactComponent.RightClickMenu
            menu={<RowMenu track={props.track} />}
        >
            <div
                role="row"
                aria-rowindex={props.index + 2}
                aria-selected={selected}
                onClick={() => setSelected((prev) => !prev)}
                onDoubleClick={play}
            >
                <div
                    className={`main-trackList-trackListRow main-trackList-trackListRowGrid ${
                        active ? 'main-trackList-active' : ''
                    } ${selected ? 'main-trackList-selected' : ''}`}
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
                            <span
                                className="main-trackList-number"
                                data-encore-id="type"
                            >
                                {props.index + 1}
                            </span>
                            <button
                                className="main-trackList-rowImagePlayButton"
                                aria-label="Lire X par X"
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
                                >
                                    <path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div
                        className="main-trackList-rowSectionStart"
                        role="gridcell"
                        aria-colindex={2}
                        tabIndex={-1}
                    >
                        <img
                            aria-hidden="false"
                            draggable="false"
                            loading="eager"
                            src={props.track.album.images[0].url}
                            alt=""
                            className="main-image-image main-trackList-rowImage main-image-loaded"
                            width="40"
                            height="40"
                        />
                        <div className="main-trackList-rowMainContent">
                            <div
                                dir="auto"
                                className="main-trackList-rowTitle standalone-ellipsis-one-line"
                                data-encore-id="type"
                            >
                                {props.track.name}
                            </div>
                            <span
                                className="main-trackList-rowSubTitle standalone-ellipsis-one-line"
                                data-encore-id="type"
                            >
                                {props.track.artists.map((a) => (
                                    <a
                                        draggable="true"
                                        dir="auto"
                                        href="#"
                                        tabIndex={-1}
                                    >
                                        {a.name}
                                    </a>
                                ))}
                            </span>
                        </div>
                    </div>
                    <div
                        className="main-trackList-rowSectionVariable"
                        role="gridcell"
                        aria-colindex={3}
                        tabIndex={-1}
                    >
                        <span data-encore-id="type">
                            <Spicetify.ReactComponent.RightClickMenu
                                menu={
                                    <Spicetify.ReactComponent.Menu>
                                        <Spicetify.ReactComponent.MenuItem>
                                            <span>Album menu</span>
                                        </Spicetify.ReactComponent.MenuItem>
                                    </Spicetify.ReactComponent.Menu>
                                }
                            >
                                <a
                                    draggable="true"
                                    className="standalone-ellipsis-one-line"
                                    dir="auto"
                                    href="#"
                                    tabIndex={-1}
                                >
                                    {props.track.album.name}
                                </a>
                            </Spicetify.ReactComponent.RightClickMenu>
                        </span>
                    </div>
                    <div
                        className="main-trackList-rowSectionVariable"
                        role="gridcell"
                        aria-colindex={4}
                        tabIndex={-1}
                    >
                        <span data-encore-id="type">
                            {props.track.addedAt.toLocaleDateString()}
                        </span>
                    </div>
                    <div
                        className="main-trackList-rowSectionEnd"
                        role="gridcell"
                        aria-colindex={5}
                        tabIndex={-1}
                    >
                        <div
                            className="main-trackList-rowDuration"
                            data-encore-id="type"
                        >
                            {Spicetify.Player.formatTime(
                                props.track.duration.milliseconds
                            )}
                        </div>
                        <button
                            type="button"
                            aria-haspopup="menu"
                            aria-label="Plus d'options pour Infestation par DM DOKURO"
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
                            >
                                <path d="M3 8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm6.5 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM16 8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </Spicetify.ReactComponent.RightClickMenu>
    );
}
