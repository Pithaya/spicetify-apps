import React, {
    Children,
    type MouseEventHandler,
    type PropsWithChildren,
    useRef,
    useState,
    useEffect,
} from 'react';
import { getTranslation } from '@shared/utils/translations.utils';
import type { ITrack } from './models/interfaces';
import { useIntersectionObserver } from '@shared/hooks/use-intersection-observer';
import { SpotifyIcon } from '@shared/components/ui/SpotifyIcon/SpotifyIcon';
import type { DisplayType } from './models/sort-option';
import { useIsInLibrary } from '@shared/hooks/use-is-in-library';
import { getPlatformApiOrThrow } from '@shared/utils/spicetify-utils';
import type {
    LibraryAPI,
    LibraryAPIOperationCompleteEvent,
} from '@shared/platform/library';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';

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
                itemMimeTypes?: (unknown | undefined)[];
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
};

/**
 * Row for a track in the TrackListGrid.
 */
export function TrackListRow(props: PropsWithChildren<Props>): JSX.Element {
    const rowRef = useRef<HTMLDivElement>(null);
    const visible = useIntersectionObserver(rowRef);
    const [isHovered, setIsHovered] = useState(false);
    const [trackInLibrary, setTrackInLibrary] = useIsInLibrary(props.track.uri);

    const libraryApi = getPlatformApiOrThrow<LibraryAPI>('LibraryAPI');

    async function addToLikedSongs(): Promise<void> {
        await libraryApi.add({
            uris: [props.track.uri],
        });
    }

    async function removeFromLikedSongs(): Promise<void> {
        await libraryApi.remove({
            uris: [props.track.uri],
        });
    }

    useEffect(() => {
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
    }, [visible, props.track.uri]);

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
                }}
                onClick={removeFromLikedSongs}
                semanticColor="essentialBrightAccent"
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

    // TODO: Set the correct aria-rowindex
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
                <Spicetify.ReactComponent.RightClickMenu
                    menu={props.getRowMenu(props.track)}
                >
                    <div
                        aria-selected={props.selected}
                        onClick={props.onClick}
                        onDoubleClick={props.onDoubleClick}
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
                        >
                            <div
                                className="main-trackList-rowSectionIndex"
                                aria-colindex={1}
                                tabIndex={-1}
                            >
                                <div className="main-trackList-rowMarker">
                                    {!props.playing ? (
                                        <>
                                            <span className="main-trackList-number">
                                                {props.index}
                                            </span>

                                            <Spicetify.ReactComponent.TooltipWrapper
                                                label={getTranslation(
                                                    ['tracklist.a11y.play'],
                                                    props.track.name,
                                                    props.track.artists
                                                        .map((a) => a.name)
                                                        .join(', '),
                                                )}
                                                showDelay={200}
                                            >
                                                <button
                                                    className="main-trackList-rowImagePlayButton"
                                                    aria-label={getTranslation(
                                                        ['tracklist.a11y.play'],
                                                        props.track.name,
                                                        props.track.artists
                                                            .map((a) => a.name)
                                                            .join(', '),
                                                    )}
                                                    onClick={() => {
                                                        if (props.active) {
                                                            Spicetify.Player.play();
                                                        } else {
                                                            props.onDoubleClick();
                                                        }
                                                    }}
                                                    tabIndex={-1}
                                                >
                                                    <svg
                                                        height="24"
                                                        width="24"
                                                        aria-hidden="true"
                                                        className="main-trackList-rowPlayPauseIcon"
                                                        viewBox="0 0 24 24"
                                                        data-encore-id="icon"
                                                        fill="currentColor"
                                                    >
                                                        <path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z"></path>
                                                    </svg>
                                                </button>
                                            </Spicetify.ReactComponent.TooltipWrapper>
                                        </>
                                    ) : (
                                        <>
                                            <img
                                                className="main-trackList-playingIcon"
                                                width="14"
                                                height="14"
                                                alt=""
                                                src="/images/equaliser-animated-green.gif"
                                            />
                                            <Spicetify.ReactComponent.TooltipWrapper
                                                label={getTranslation([
                                                    'playback-control.pause',
                                                ])}
                                                showDelay={200}
                                            >
                                                <button
                                                    className="main-trackList-rowImagePlayButton"
                                                    aria-label={getTranslation([
                                                        'playback-control.pause',
                                                    ])}
                                                    tabIndex={0}
                                                    aria-expanded="false"
                                                    onClick={() => {
                                                        Spicetify.Player.pause();
                                                    }}
                                                >
                                                    <svg
                                                        height="24"
                                                        width="24"
                                                        aria-hidden="true"
                                                        fill="currentColor"
                                                        className="main-trackList-rowPlayPauseIcon"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M5.7 3a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7H5.7zm10 0a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7h-2.6z"></path>
                                                    </svg>
                                                </button>
                                            </Spicetify.ReactComponent.TooltipWrapper>
                                        </>
                                    )}
                                </div>
                            </div>

                            {props.children &&
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
                </Spicetify.ReactComponent.RightClickMenu>
            ) : (
                placeholder
            )}
        </div>
    );
}
