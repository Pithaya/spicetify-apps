import { LocalTrack } from '@shared';
import React, { useState } from 'react';
import { TrackListRow } from './track-list-row';
import { IProps as SortProps } from '../filters/sort-menu';
import { TrackListHeader, TrackListHeaderProps } from './track-list-header';

export interface TrackListGridProps extends SortProps, TrackListHeaderProps {
    tracks: LocalTrack[];
    gridLabel: string;
    activeTrackUri: string;
    onPlayTrack: (uri: string) => void;
}

export function TrackListGrid(props: TrackListGridProps) {
    // TODO: Multi selection
    const [selectedTrackUri, setSelectedTrackUri] = useState<string | null>(
        null
    );

    return (
        <>
            <div
                role="grid"
                aria-rowcount={props.tracks.length}
                aria-colcount={props.headers.length + 2}
                aria-label={props.gridLabel}
                className="main-trackList-trackList main-trackList-indexable"
                tabIndex={0}
            >
                <TrackListHeader
                    headers={props.headers}
                    sortedHeader={props.sortedHeader}
                    onHeaderClicked={props.onHeaderClicked}
                ></TrackListHeader>

                <div role="presentation">
                    <div role="presentation">
                        {props.tracks.map((track, index) => (
                            <TrackListRow
                                key={track.uri}
                                track={track}
                                index={index}
                                selected={selectedTrackUri === track.uri}
                                active={props.activeTrackUri === track.uri}
                                onClick={() => setSelectedTrackUri(track.uri)}
                                onDoubleClick={() =>
                                    props.onPlayTrack(track.uri)
                                }
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
