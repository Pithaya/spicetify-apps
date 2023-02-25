import { LocalTrack } from '@shared';
import React from 'react';
import { TrackListHeader } from './track-list-header';
import { TrackListRow } from './track-list-row';

export interface IProps {
    tracks: LocalTrack[];
}

export function TrackList(props: IProps) {
    // TODO: aria from props
    return (
        <>
            <div className="contentSpacing">
                <div
                    role="grid"
                    aria-rowcount={props.tracks.length}
                    aria-colcount={5}
                    aria-label="Titres likés"
                    className="main-trackList-trackList main-trackList-indexable"
                    tabIndex={0}
                >
                    <TrackListHeader></TrackListHeader>

                    <div
                        //className="main-rootlist-wrapper"
                        //style="height: 237384px; --row-height: 56px"
                        role="presentation"
                    >
                        <div
                            //style="transform: translateY(0px)"
                            role="presentation"
                        >
                            {props.tracks.map((track, index) => (
                                <TrackListRow
                                    key={track.uri}
                                    track={track}
                                    index={index}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
