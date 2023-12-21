import { ARTIST_ROUTE } from 'custom-apps/better-local-files/src/constants/constants';
import { navigateTo } from 'custom-apps/better-local-files/src/helpers/history-helper';
import type { Track } from 'custom-apps/better-local-files/src/models/track';
import React from 'react';

type Props = {
    track: Track;
    withArtists: boolean;
};

export function TrackListRowTitle(props: Readonly<Props>): JSX.Element {
    return (
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
                                onClick={() => {
                                    navigateTo(ARTIST_ROUTE, a.uri);
                                }}
                                key={a.uri}
                            >
                                {a.name}
                            </a>
                        ))
                        .reduce(
                            (accu: JSX.Element[] | null, elem: JSX.Element) => {
                                return accu === null
                                    ? [elem]
                                    : [...accu, <>{', '}</>, elem];
                            },
                            null,
                        )}
                </span>
            )}
        </div>
    );
}
