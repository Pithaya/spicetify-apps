import { SpotifyIcon } from '@shared/components/ui/SpotifyIcon/SpotifyIcon';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { useIntersectionObserver } from '@shared/hooks/use-intersection-observer';
import { useIsInLibrary } from '@shared/hooks/use-is-in-library';
import type { LibraryAPIOperationCompleteEvent } from '@shared/platform/library';
import { getPlatform } from '@shared/utils/spicetify-utils';
import { getTranslation } from '@shared/utils/translations.utils';
import { highlightSearchTerm } from 'highlight-search-term';
import React, {
    Children,
    type MouseEventHandler,
    type PropsWithChildren,
    useEffect,
    useRef,
    useState,
} from 'react';
import type { ITrack } from './models/interfaces';
import type { DisplayType } from './models/sort-option';
import { TrackListRowMarker } from './TrackListRowMarker';

export type Props = {
    track: ITrack;
    index: number;
    selected: boolean;
    active: boolean;
    playing: boolean;
    onClick: MouseEventHandler<HTMLDivElement>;
    onDoubleClick: () => void;
    dragHandler: {
        draggable: boolean;
        onDragStart: (
            event: React.DragEvent,
            params?: {
                itemUris?: string[];
                itemMimeTypes?: unknown[];
                dragLabelText?: string;
                contextUri?: string;
                sectionId?: number;
                dropOriginUri?: string;
                itemIds?: unknown;
            },
        ) => void;
    };
    displayType: DisplayType;
    getRowMenu: (track: ITrack) => JSX.Element;
    searchTerm: string;
};

/**
 * Row for a track in the TrackListGrid.
 */
export function TrackListRow(props: PropsWithChildren<Props>): JSX.Element {
    const rowRef = useRef<HTMLDivElement>(null);
    const visible = useIntersectionObserver(rowRef);
    const [isHovered, setIsHovered] = useState(false);
    const [trackInLibrary, setTrackInLibrary] = useIsInLibrary(props.track.uri);

    async function addToLikedSongs(): Promise<void> {
        const libraryApi = getPlatform().LibraryAPI;
        await libraryApi.add({
            uris: [props.track.uri],
        });
    }

    async function removeFromLikedSongs(): Promise<void> {
        const libraryApi = getPlatform().LibraryAPI;
        await libraryApi.remove({
            uris: [props.track.uri],
        });
    }

    useEffect(() => {
        const libraryApi = getPlatform().LibraryAPI;

        if (!visible) {
            // Only listen to the event when the row is visible
            return;
        }

        const listener = (e: LibraryAPIOperationCompleteEvent): void => {
            if (e.data.uris.some((u) => u === props.track.uri)) {
                if (e.data.operation === 'add') {
                    setTrackInLibrary(true);
                } else if (e.data.operation === 'remove') {
                    setTrackInLibrary(false);
                }
            }
        };

        libraryApi.getEvents().addListener('operation_complete', listener);

        return () => {
            libraryApi
                .getEvents()
                .removeListener('operation_complete', listener);
        };
    }, [visible, props.track.uri, setTrackInLibrary]);

    const placeholder = (
        <div
            style={{
                height: props.displayType === 'compact' ? '32px' : '54px',
            }}
        ></div>
    );

    const addToLibraryButton = (
        <Spicetify.ReactComponent.TooltipWrapper
            label={getTranslation(['save_to_your_liked_songs'])}
            showDelay={100}
        >
            <Spicetify.ReactComponent.ButtonTertiary
                aria-label={getTranslation(['save_to_your_liked_songs'])}
                iconOnly={() => <SpotifyIcon icon="plus-alt" iconSize={16} />}
                buttonSize="sm"
                style={{
                    padding: 0,
                    visibility: isHovered ? undefined : 'hidden',
                }}
                onClick={addToLikedSongs}
            ></Spicetify.ReactComponent.ButtonTertiary>
        </Spicetify.ReactComponent.TooltipWrapper>
    );

    const removeFromLibraryButton = (
        <Spicetify.ReactComponent.TooltipWrapper
            label={getTranslation(['remove_from_your_liked_songs'])}
            showDelay={100}
        >
            <Spicetify.ReactComponent.ButtonTertiary
                aria-label={getTranslation(['remove_from_your_liked_songs'])}
                iconOnly={() => (
                    <SpotifyIcon icon="check-alt-fill" iconSize={16} />
                )}
                buttonSize="sm"
                style={{
                    padding: 0,
                    color: 'var(--spice-button-active)',
                }}
                onClick={removeFromLikedSongs}
            ></Spicetify.ReactComponent.ButtonTertiary>
        </Spicetify.ReactComponent.TooltipWrapper>
    );

    const emptyButton = (
        <Spicetify.ReactComponent.ButtonTertiary
            iconOnly={() => <></>}
            buttonSize="sm"
            style={{
                padding: 0,
                visibility: isHovered ? undefined : 'hidden',
            }}
        ></Spicetify.ReactComponent.ButtonTertiary>
    );

    let libraryButton: JSX.Element;

    switch (trackInLibrary) {
        case true:
            libraryButton = removeFromLibraryButton;
            break;
        case false:
            libraryButton = addToLibraryButton;
            break;
        default:
            libraryButton = emptyButton;
            break;
    }

    useEffect(() => {
        highlightSearchTerm({
            search: props.searchTerm,
            selector: '.main-trackList-trackListRow',
        });
    }, [visible, props.searchTerm]);

    // TODO: Set the correct aria-rowindex
    // TODO: Remove element hidden when '!props.track.isPlayable' when the disabled css class is available
    return (
        <div
            ref={rowRef}
            onMouseEnter={() => {
                setIsHovered(true);
            }}
            onMouseLeave={() => {
                setIsHovered(false);
            }}
        >
            {visible ? (
                <Spicetify.ReactComponent.ContextMenu
                    trigger="right-click"
                    action="toggle"
                    menu={props.getRowMenu(props.track)}
                >
                    <div
                        aria-selected={props.selected}
                        onClick={props.onClick}
                        onDoubleClick={() => {
                            if (props.track.isPlayable) {
                                props.onDoubleClick();
                            }
                        }}
                        draggable="true"
                        onDragStart={(e) => {
                            if (props.dragHandler.draggable) {
                                props.dragHandler.onDragStart(e);
                            }
                        }}
                    >
                        <div
                            className={`main-trackList-trackListRow main-trackList-trackListRowGrid ${
                                props.active ? 'main-trackList-active' : ''
                            } ${
                                props.selected ? 'main-trackList-selected' : ''
                            } ${
                                props.displayType === 'compact'
                                    ? 'main-trackList-rowCompactMode'
                                    : ''
                            }`}
                            style={{
                                opacity: props.track.isPlayable ? 1 : 0.4,
                            }}
                        >
                            <div
                                className="main-trackList-rowSectionIndex"
                                aria-colindex={1}
                                tabIndex={-1}
                            >
                                <TrackListRowMarker
                                    track={props.track}
                                    index={props.index}
                                    selected={props.selected}
                                    active={props.active}
                                    playing={props.playing}
                                    onDoubleClick={props.onDoubleClick}
                                />
                            </div>

                            {props.children !== undefined &&
                                Children.map(props.children, (child, index) => {
                                    return (
                                        <div
                                            className={
                                                index === 0
                                                    ? 'main-trackList-rowSectionStart'
                                                    : 'main-trackList-rowSectionVariable'
                                            }
                                            aria-colindex={index + 2}
                                            tabIndex={-1}
                                        >
                                            {child}
                                        </div>
                                    );
                                })}

                            <div
                                className="main-trackList-rowSectionEnd"
                                aria-colindex={
                                    Children.count(props.children) + 2
                                }
                                tabIndex={-1}
                            >
                                {libraryButton}

                                <TextComponent
                                    variant="mesto"
                                    semanticColor="textSubdued"
                                    className="main-trackList-rowDuration"
                                >
                                    {Spicetify.Player.formatTime(
                                        props.track.duration,
                                    )}
                                </TextComponent>

                                <Spicetify.ReactComponent.TooltipWrapper
                                    label={getTranslation(
                                        ['more.label.track'],
                                        props.track.name,
                                        props.track.artists
                                            .map((a) => a.name)
                                            .join(', '),
                                    )}
                                    showDelay={100}
                                >
                                    <div>
                                        <Spicetify.ReactComponent.ContextMenu
                                            trigger="click"
                                            action="toggle"
                                            menu={props.getRowMenu(props.track)}
                                        >
                                            <Spicetify.ReactComponent.ButtonTertiary
                                                aria-label={getTranslation(
                                                    ['more.label.track'],
                                                    props.track.name,
                                                    props.track.artists
                                                        .map((a) => a.name)
                                                        .join(', '),
                                                )}
                                                aria-haspopup="menu"
                                                iconOnly={() => (
                                                    <SpotifyIcon
                                                        icon="more"
                                                        iconSize={16}
                                                    />
                                                )}
                                                buttonSize="sm"
                                                style={{
                                                    padding: 0,
                                                    visibility: isHovered
                                                        ? undefined
                                                        : 'hidden',
                                                }}
                                            ></Spicetify.ReactComponent.ButtonTertiary>
                                        </Spicetify.ReactComponent.ContextMenu>
                                    </div>
                                </Spicetify.ReactComponent.TooltipWrapper>
                            </div>
                        </div>
                    </div>
                </Spicetify.ReactComponent.ContextMenu>
            ) : (
                placeholder
            )}
        </div>
    );
}
