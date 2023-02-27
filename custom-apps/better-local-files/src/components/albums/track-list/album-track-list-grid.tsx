import { LocalTrack } from '@shared';
import React, { useState } from 'react';
import { AlbumTrackListHeader } from './album-track-list-header';
import { AlbumTrackListRow } from './album-track-list-row';

export interface IProps {
    tracks: LocalTrack[];
    onPlayTrack: (uri: string) => void;
}

export function AlbumTrackListGrid(props: IProps) {
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
                <AlbumTrackListHeader></AlbumTrackListHeader>

                <div role="presentation">
                    <div role="presentation">
                        {props.tracks.map((track, index) => (
                            <AlbumTrackListRow
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
