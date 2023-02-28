import { LocalTrack } from '@shared';
import React, { useState } from 'react';
import { TrackListHeader } from './track-list-header';
import { TrackListRow } from './track-list-row';
import { IProps as SortProps } from '../../tracks/menus/sort-menu';

export interface IProps extends SortProps {
    tracks: LocalTrack[];
    onPlayTrack: (uri: string) => void;
}

export function TrackListGrid(props: IProps) {
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
                    sortOptions={props.sortOptions}
                    selectedSortOption={props.selectedSortOption}
                    setSelectedSortOption={props.setSelectedSortOption}
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
