import { LocalTrack } from '@shared';
import React, { useState } from 'react';
import { TrackListRow } from './track-list-row';
import { IProps as SortProps } from '../../shared/menus/sort-menu';
import {
    TrackListHeader,
    TrackListHeaderProps,
} from '../../shared/track-list/track-list-header';

export interface IProps extends SortProps, TrackListHeaderProps {
    tracks: LocalTrack[];
    onPlayTrack: (uri: string) => void;
}

export function TrackListGrid(props: IProps) {
    // TODO: Multi selection
    const [selectedTrackUri, setSelectedTrackUri] = useState<string | null>(
        null
    );

    // TODO: aria from props
    return (
        <>
            <div
                role="grid"
                aria-rowcount={props.tracks.length}
                aria-colcount={5}
                aria-label="Titres likés"
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
