import { Routes } from 'custom-apps/better-local-files/src/constants/constants';
import { navigateTo } from 'custom-apps/better-local-files/src/helpers/history-helper';
import { Track } from 'custom-apps/better-local-files/src/models/track';
import React from 'react';

interface TrackListRowTitleProps {
    track: Track;
    withArtists: boolean;
}

export function TrackListRowTitle(props: TrackListRowTitleProps) {
    return (
        <>
            <div className="main-trackList-rowMainContent">
                <div
                    dir="auto"
                    className="main-trackList-rowTitle standalone-ellipsis-one-line"
                >
                    {props.track.name}
                </div>
                {props.withArtists && (
                    <span className="main-trackList-rowSubTitle standalone-ellipsis-one-line">
                        {props.track.artists
                            .map((a) => (
                                <a
                                    draggable="true"
                                    dir="auto"
                                    href="#"
                                    tabIndex={-1}
                                    onClick={() =>
                                        navigateTo(Routes.artist, a.uri)
                                    }
                                >
                                    {a.name}
                                </a>
                            ))
                            .reduce(
                                (
                                    accu: JSX.Element[] | null,
                                    elem: JSX.Element
                                ) => {
                                    return accu === null
                                        ? [elem]
                                        : [...accu, <>{', '}</>, elem];
                                },
                                null
                            )}
                    </span>
                )}
            </div>
        </>
    );
}
