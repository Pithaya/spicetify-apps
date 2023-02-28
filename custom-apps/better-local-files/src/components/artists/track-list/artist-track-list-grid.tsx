import { LocalTrack } from '@shared';
import React, { useState } from 'react';
import { ArtistTrackListHeader } from './artist-track-list-header';
import { ArtistTrackListRow } from './artist-track-list-row';

export interface IProps {
    tracks: LocalTrack[];
    onPlayTrack: (uri: string) => void;
}

export function ArtistTrackListGrid(props: IProps) {
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
                <ArtistTrackListHeader></ArtistTrackListHeader>

                <div role="presentation">
                    <div role="presentation">
                        {props.tracks.map((track, index) => (
                            <ArtistTrackListRow
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
