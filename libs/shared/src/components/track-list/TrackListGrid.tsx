import type { DisplayType } from '@shared/components/track-list/models/sort-option';
import { useCurrentPlayerTrackUri } from '@shared/hooks/use-current-uri';
import { type PlayStatus, usePlayStatus } from '@shared/hooks/use-play-status';
import { getTranslation } from '@shared/utils/translations.utils';
import React, { useMemo, useState } from 'react';
import type { ITrack } from './models/interfaces';
import styles from './TrackListGrid.module.scss';
import type { Props as TrackListHeaderProps } from './TrackListHeader';
import { TrackListHeader } from './TrackListHeader';
import { TrackListRow } from './TrackListRow';

export type SubTracksList = {
    headerRow: JSX.Element;
    tracks: ITrack[];
};

export type Props<T extends string> = {
    tracks: ITrack[];
    subtracks: SubTracksList[];
    gridLabel: string;
    useTrackNumber: boolean;
    onPlayTrack: (uri: string) => void;
    getRowContent: (track: ITrack) => JSX.Element[];
    displayType: DisplayType;
    getRowMenu: (track: ITrack) => JSX.Element;
} & TrackListHeaderProps<T>;

/**
 * Contains the track list header and rows.
 */
export function TrackListGrid<T extends string>(
    props: Readonly<Props<T>>,
): JSX.Element {
    const activeTrackUri = useCurrentPlayerTrackUri();
    const playStatus: PlayStatus = usePlayStatus();

    const [selectedTracks, setSelectedTracks] = useState<Map<string, ITrack>>(
        new Map<string, ITrack>(),
    );
    const dragHandler = useMemo(() => {
        const mapAsArray: [string, ITrack][] = Array.from(
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
                          selectedTracks.size.toFixed(),
                      )
                    : mapAsArray[0][1].name,
        });
    }, [selectedTracks]);

    function handleClick(
        e: React.MouseEvent<HTMLDivElement>,
        track: ITrack,
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

            setSelectedTracks(new Map<string, ITrack>(selectedTracks));
        } else {
            // Simple click sets one track
            setSelectedTracks(new Map<string, ITrack>([[track.uri, track]]));
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
                    className={
                        props.displayType === 'compact'
                            ? styles['display-list-compact']
                            : styles['display-list']
                    }
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
                            getRowMenu={props.getRowMenu}
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
                                        getRowMenu={props.getRowMenu}
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
