import type { DisplayType } from '@shared/components/track-list/models/sort-option';
import { useCurrentPlayerTrackUri } from '@shared/hooks/use-current-uri';
import { PlayStatus, usePlayStatus } from '@shared/hooks/use-play-status';
import { getTranslation } from '@shared/utils/translations.utils';
import React, { useMemo, useState } from 'react';
import type { ITrack } from './models/interfaces';
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

    const variableColumnCount = Math.max(0, props.headers.length - 1);
    const variableColumns = Array.from(
        { length: variableColumnCount },
        (_, i) =>
            `[var${(i + 1).toString()}] minmax(var(--var${(i + 1).toString()}-min-width), var(--var${(i + 1).toString()}-max-width, 2fr))`,
    ).join(' ');
    const gridTemplateColumns = `[index] var(--index-column-width, 16px) [first] minmax(var(--first-min-width), var(--first-max-width, 4fr)) ${variableColumns} [last] minmax(var(--last-min-width), var(--last-max-width, 1fr))`;

    const style = {
        '--placeholder-image': 'url(/images/tracklist-placeholder.webp)',
        '--placeholder-image-compact':
            'url(/images/tracklist-placeholder-compact.webp)',
        '--row-height': props.displayType === 'compact' ? '32px' : '56px',
        '--grid-template-columns': gridTemplateColumns,
        '--first-min-width': '180px',
        '--var1-min-width': '120px',
        '--var2-min-width': '120px',
        '--var3-min-width': '120px',
        '--last-min-width': '120px',
    } as React.CSSProperties;

    return (
        <div className="contentSpacing">
            <div
                role="grid"
                aria-rowcount={props.tracks.length}
                aria-colcount={props.headers.length + 2}
                aria-label={props.gridLabel}
                className="main-trackList-trackList main-trackList-indexable"
                tabIndex={0}
                style={style}
            >
                <TrackListHeader
                    headers={props.headers}
                    sortedHeader={props.sortedHeader}
                    onHeaderClicked={props.onHeaderClicked}
                ></TrackListHeader>

                <div>
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
                                playStatus === PlayStatus.Playing
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
                                            playStatus === PlayStatus.Playing
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
