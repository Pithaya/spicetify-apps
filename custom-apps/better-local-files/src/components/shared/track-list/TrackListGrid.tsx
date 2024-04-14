import styles from './TrackListGrid.module.scss';
import React, { useMemo, useState } from 'react';
import { TrackListRow } from './TrackListRow';
import { TrackListHeader } from './TrackListHeader';
import type { Props as TrackListHeaderProps } from './TrackListHeader';
import { useCurrentPlayerTrackUri } from 'custom-apps/better-local-files/src/hooks/use-current-uri';
import type { Track } from 'custom-apps/better-local-files/src/models/track';
import {
    type PlayStatus,
    usePlayStatus,
} from 'custom-apps/better-local-files/src/hooks/use-play-status';
import { getTranslation } from 'custom-apps/better-local-files/src/helpers/translations-helper';
import type { DisplayType } from 'custom-apps/better-local-files/src/models/sort-option';

export type SubTracksList = {
    headerRow: JSX.Element;
    tracks: Track[];
};

export type Props = {
    tracks: Track[];
    subtracks: SubTracksList[];
    gridLabel: string;
    useTrackNumber: boolean;
    onPlayTrack: (uri: string) => void;
    getRowContent: (track: Track) => JSX.Element[];
    displayType: DisplayType;
} & TrackListHeaderProps;

/**
 * Contains the track list header and rows.
 */
export function TrackListGrid(props: Readonly<Props>): JSX.Element {
    const activeTrackUri = useCurrentPlayerTrackUri();
    const playStatus: PlayStatus = usePlayStatus();

    const [selectedTracks, setSelectedTracks] = useState<Map<string, Track>>(
        new Map<string, Track>(),
    );
    const dragHandler = useMemo(() => {
        const mapAsArray: [string, Track][] = Array.from(
            selectedTracks.entries(),
        );

        if (mapAsArray.length === 0) {
            return Spicetify.ReactHook.DragHandler({
                itemUris: [],
                dragLabelText: '',
            });
        }

        return Spicetify.ReactHook.DragHandler({
            itemUris: mapAsArray.map((t) => t[0]),
            dragLabelText:
                selectedTracks.size > 1
                    ? getTranslation(
                          ['tracklist.drag.multiple.label', 'other'],
                          selectedTracks.size,
                      )
                    : mapAsArray[0][1].name,
        });
    }, [selectedTracks]);

    function handleClick(
        e: React.MouseEvent<HTMLDivElement>,
        track: Track,
    ): void {
        // TODO: Shift only adds tracks to the selection,
        // Between the last selected track and the clicked track

        if (e.ctrlKey) {
            // Ctrl adds/removes the clicked track from the selection
            if (selectedTracks.has(track.uri)) {
                selectedTracks.delete(track.uri);
            } else {
                selectedTracks.set(track.uri, track);
            }

            setSelectedTracks(new Map<string, Track>(selectedTracks));
        } else {
            // Simple click sets one track
            setSelectedTracks(new Map<string, Track>([[track.uri, track]]));
        }
    }

    return (
        <div className="contentSpacing">
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

                <div
                    className={`${
                        props.displayType === 'compact'
                            ? styles['display-list-compact']
                            : styles['display-list']
                    }`}
                >
                    {props.tracks.map((track, index) => (
                        <TrackListRow
                            key={track.uri}
                            track={track}
                            index={
                                props.useTrackNumber
                                    ? track.trackNumber
                                    : index + 1
                            }
                            selected={selectedTracks.has(track.uri)}
                            active={activeTrackUri === track.uri}
                            playing={
                                activeTrackUri === track.uri &&
                                playStatus === 'play'
                            }
                            onClick={(e) => {
                                handleClick(e, track);
                            }}
                            onDoubleClick={() => {
                                props.onPlayTrack(track.uri);
                            }}
                            dragHandler={dragHandler}
                            displayType={props.displayType}
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
                                        index={
                                            props.useTrackNumber
                                                ? track.trackNumber
                                                : index + 1
                                        }
                                        selected={selectedTracks.has(track.uri)}
                                        active={activeTrackUri === track.uri}
                                        playing={
                                            activeTrackUri === track.uri &&
                                            playStatus === 'play'
                                        }
                                        onClick={(e) => {
                                            handleClick(e, track);
                                        }}
                                        onDoubleClick={() => {
                                            props.onPlayTrack(track.uri);
                                        }}
                                        dragHandler={dragHandler}
                                        displayType={props.displayType}
                                    >
                                        {props.getRowContent(track)}
                                    </TrackListRow>
                                ))}
                            </>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
