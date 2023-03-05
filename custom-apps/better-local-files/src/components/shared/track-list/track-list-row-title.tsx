import { LocalTrack } from '@shared';
import React from 'react';

// TODO: Only relevant props
interface TrackListRowTitleProps {
    track: LocalTrack;
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
                        {props.track.artists.map((a) => (
                            // TODO: navigate
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
                )}
            </div>
        </>
    );
}
