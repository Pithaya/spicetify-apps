import { LocalTrack } from '@shared';
import React, { useState } from 'react';
import { TrackListRow } from './track-list-row';
import { TrackListHeader, TrackListHeaderProps } from './track-list-header';
import { TrackListRowImageTitle } from './track-list-row-image-title';
import { TrackListRowAlbumLink } from './track-list-row-album-link';
import { useCurrentPlayerTrackUri } from 'custom-apps/better-local-files/src/hooks/use-current-uri';

export type SubTracksList = {
    headerRow: JSX.Element;
    tracks: LocalTrack[];
};

export interface TrackListGridProps extends TrackListHeaderProps {
    tracks: LocalTrack[];
    subtracks: SubTracksList[];
    gridLabel: string;
    onPlayTrack: (uri: string) => void;
    getRowContent: (track: LocalTrack) => JSX.Element[];
}

/**
 * Contains the track list header and rows.
 */
export function TrackListGrid(props: TrackListGridProps) {
    const activeTrackUri = useCurrentPlayerTrackUri();

    // TODO: Multi selection
    const [selectedTrackUri, setSelectedTrackUri] = useState<string | null>(
        null
    );

    // TODO: Fix aria index
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
                    {props.tracks.map((track, index) => (
                        <TrackListRow
                            key={track.uri}
                            track={track}
                            index={index}
                            selected={selectedTrackUri === track.uri}
                            active={activeTrackUri === track.uri}
                            onClick={() => setSelectedTrackUri(track.uri)}
                            onDoubleClick={() => props.onPlayTrack(track.uri)}
                        >
                            {props.getRowContent(track)}
                        </TrackListRow>
                    ))}

                    {props.subtracks.map((sub) => {
                        return (
                            <>
                                {sub.headerRow}
                                {sub.tracks.map((track, index) => (
                                    <TrackListRow
                                        key={track.uri}
                                        track={track}
                                        index={index}
                                        selected={
                                            selectedTrackUri === track.uri
                                        }
                                        active={activeTrackUri === track.uri}
                                        onClick={() =>
                                            setSelectedTrackUri(track.uri)
                                        }
                                        onDoubleClick={() =>
                                            props.onPlayTrack(track.uri)
                                        }
                                    >
                                        {props.getRowContent(track)}
                                    </TrackListRow>
                                ))}
                            </>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
