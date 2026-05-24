import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { LucideChevronDown } from 'lucide-react';
import React, {
    type DragEvent,
    type KeyboardEvent,
    type PropsWithChildren,
} from 'react';
import { useAppStore } from '../../stores/store';
import { type CustomNodeType } from '../../types/node-types';

type SidenavItemProps = {
    nodeType: CustomNodeType;
    label: string;
    tooltip: string;
};

function SidenavItem(props: Readonly<SidenavItemProps>): JSX.Element {
    const addNode = useAppStore((state) => state.addNode);

    const onNodeSelected = (nodeType: CustomNodeType): void => {
        addNode(nodeType, { x: 0, y: 0 });
    };

    const onDragStart = (event: DragEvent, nodeType: CustomNodeType): void => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <li>
            <Spicetify.ReactComponent.TooltipWrapper
                label={props.tooltip}
                showDelay={500}
            >
                <button
                    onDragStart={(event) => {
                        onDragStart(event, props.nodeType);
                    }}
                    draggable
                    tabIndex={0}
                    onKeyDown={(event: KeyboardEvent) => {
                        if (event.key === 'Enter') {
                            onNodeSelected(props.nodeType);
                        }
                    }}
                    className="tw:hover:bg-spice-highlight tw:hover:text-spice-text tw:w-full tw:cursor-grab tw:border-none tw:bg-transparent tw:py-1 tw:text-start"
                >
                    <TextComponent elementType="span" fontSize="medium">
                        {props.label}
                    </TextComponent>
                </button>
            </Spicetify.ReactComponent.TooltipWrapper>
        </li>
    );
}

function SidenavCollapsible(
    props: Readonly<PropsWithChildren<{ label: string }>>,
): JSX.Element {
    return (
        <details className="tw:group">
            <summary className="tw:flex tw:cursor-pointer tw:list-none tw:items-center tw:gap-1">
                <TextComponent
                    elementType="h2"
                    weight="bold"
                    fontSize="medium"
                    className="tw:inline"
                >
                    {props.label}
                </TextComponent>
                <LucideChevronDown className="tw:transition-transform tw:group-open:rotate-180" />
            </summary>
            <div className="tw:mt-2">{props.children}</div>
        </details>
    );
}

function SidebarTitle(props: Readonly<{ label: string }>): JSX.Element {
    return (
        <>
            <TextComponent
                elementType="h1"
                fontSize="x-large"
                className="tw:font-normal"
            >
                {props.label}
            </TextComponent>
            <hr className="tw:divide-solid tw:opacity-60 tw:m-0" />
        </>
    );
}

export function Sidenav(): JSX.Element {
    return (
        <div className="tw:flex tw:flex-col tw:gap-2">
            <div className="tw:flex tw:flex-col tw:gap-2">
                <SidebarTitle label="Sources" />

                <SidenavCollapsible label="Library">
                    <ul>
                        <SidenavItem
                            label="Liked songs"
                            nodeType="likedSongsSource"
                            tooltip="Get tracks from your liked songs."
                        />
                        <SidenavItem
                            label="Local files"
                            nodeType="localTracksSource"
                            tooltip="Get tracks from your local files."
                        />
                        <SidenavItem
                            label="Saved playlist"
                            nodeType="libraryPlaylistSource"
                            tooltip="Get tracks from a playlist in your library."
                        />
                        <SidenavItem
                            label="Saved album"
                            nodeType="libraryAlbumSource"
                            tooltip="Get tracks from an album in your library."
                        />
                        <SidenavItem
                            label="Saved artist"
                            nodeType="libraryArtistSource"
                            tooltip="Get tracks from an artist in your library."
                        />
                        <SidenavItem
                            label="Saved track"
                            nodeType="libraryTrackSource"
                            tooltip="Get a saved track from your library."
                        />
                        <SidenavItem
                            label="Recently played"
                            nodeType="recentlyPlayedTracksSource"
                            tooltip="Get tracks from your recently played history."
                        />
                    </ul>
                </SidenavCollapsible>

                <SidenavCollapsible label="Search">
                    <ul>
                        <SidenavItem
                            label="Artist"
                            nodeType="searchArtistSource"
                            tooltip="Get tracks from an artist."
                        />
                        <SidenavItem
                            label="Playlist"
                            nodeType="searchPlaylistSource"
                            tooltip="Get tracks from a playlist."
                        />
                        <SidenavItem
                            label="Album"
                            nodeType="searchAlbumSource"
                            tooltip="Get tracks from an album."
                        />
                        <SidenavItem
                            label="Track"
                            nodeType="searchTrackSource"
                            tooltip="Get a single track."
                        />
                    </ul>
                </SidenavCollapsible>

                <SidenavCollapsible label="Radio">
                    <ul>
                        <SidenavItem
                            label="Track radio"
                            nodeType="radioTrackSource"
                            tooltip="Get a radio playlist for a track."
                        />
                        <SidenavItem
                            label="Artist radio"
                            nodeType="radioArtistSource"
                            tooltip="Get a radio playlist for an artist."
                        />
                        <SidenavItem
                            label="Album radio"
                            nodeType="radioAlbumSource"
                            tooltip="Get a radio playlist for an album."
                        />
                    </ul>
                </SidenavCollapsible>

                <SidenavCollapsible label="Playlist">
                    <ul>
                        <SidenavItem
                            label="Recommended tracks"
                            nodeType="recommendedPlaylistTracksSource"
                            tooltip="Get recommended tracks for a playlist."
                        />
                    </ul>
                </SidenavCollapsible>
            </div>

            <div className="tw:flex tw:flex-col tw:gap-2">
                <SidebarTitle label="Filters" />

                <SidenavCollapsible label="Track property">
                    <ul>
                        <SidenavItem
                            label="Is playable"
                            nodeType="isPlayable"
                            tooltip="Filter tracks that are playable."
                        />
                        <SidenavItem
                            label="Is explicit"
                            nodeType="isExplicit"
                            tooltip="Filter tracks that are explicit."
                        />
                        <SidenavItem
                            label="Is saved"
                            nodeType="isSaved"
                            tooltip="Filter tracks that are saved in your liked songs."
                        />
                        <SidenavItem
                            label="Duration"
                            nodeType="duration"
                            tooltip="Filter tracks by duration."
                        />
                    </ul>
                </SidenavCollapsible>

                <SidenavCollapsible label="Album property">
                    <ul>
                        <SidenavItem
                            label="Release date"
                            nodeType="releaseDate"
                            tooltip="Filter tracks by album release date."
                        />
                    </ul>
                </SidenavCollapsible>

                <SidenavCollapsible label="Audio features">
                    <ul>
                        <SidenavItem
                            label="Acousticness"
                            nodeType="acousticness"
                            tooltip="Filter tracks by acousticness."
                        />
                        <SidenavItem
                            label="Danceability"
                            nodeType="danceability"
                            tooltip="Filter tracks by danceability."
                        />
                        <SidenavItem
                            label="Energy"
                            nodeType="energy"
                            tooltip="Filter tracks by energy."
                        />
                        <SidenavItem
                            label="Instrumentalness"
                            nodeType="instrumentalness"
                            tooltip="Filter tracks by instrumentalness."
                        />
                        <SidenavItem
                            label="Liveness"
                            nodeType="liveness"
                            tooltip="Filter tracks by liveness."
                        />
                        <SidenavItem
                            label="Speechiness"
                            nodeType="speechiness"
                            tooltip="Filter tracks by speechiness."
                        />
                        <SidenavItem
                            label="Valence"
                            nodeType="valence"
                            tooltip="Filter tracks by valence."
                        />
                        <SidenavItem
                            label="Loudness"
                            nodeType="loudness"
                            tooltip="Filter tracks by loudness."
                        />
                        <SidenavItem
                            label="Tempo"
                            nodeType="tempo"
                            tooltip="Filter tracks by tempo."
                        />
                        <SidenavItem
                            label="Mode"
                            nodeType="mode"
                            tooltip="Filter tracks by mode."
                        />
                    </ul>
                </SidenavCollapsible>
            </div>

            <div className="tw:flex tw:flex-col tw:gap-2">
                <SidebarTitle label="Processing" />

                <ul>
                    <SidenavItem
                        label="Deduplicate"
                        nodeType="deduplicate"
                        tooltip="Remove duplicate tracks."
                    />
                    <SidenavItem
                        label="Shuffle"
                        nodeType="shuffle"
                        tooltip="Shuffle the tracks."
                    />
                    <SidenavItem
                        label="Sort"
                        nodeType="sort"
                        tooltip="Sort the tracks."
                    />
                    <SidenavItem
                        label="Intersection"
                        nodeType="intersection"
                        tooltip="Keep only the tracks that are in both inputs."
                    />
                    <SidenavItem
                        label="Difference"
                        nodeType="difference"
                        tooltip="Keep only the tracks that are not in both inputs."
                    />
                    <SidenavItem
                        label="Substract"
                        nodeType="substract"
                        tooltip="Remove tracks that are in the second input from the first input."
                    />
                    <SidenavItem
                        label="Subset"
                        nodeType="subset"
                        tooltip="Keep only the specified number of tracks."
                    />
                    <SidenavItem
                        label="Reverse"
                        nodeType="reverse"
                        tooltip="Reverse the order of the tracks."
                    />
                </ul>
            </div>

            <div className="tw:flex tw:flex-col tw:gap-2">
                <SidebarTitle label="Result" />

                <ul>
                    <SidenavItem
                        label="Add to result tab"
                        nodeType="result"
                        tooltip="Output the result in the result tab."
                    />
                    <SidenavItem
                        label="Add to playlist"
                        nodeType="addToPlaylist"
                        tooltip="Output the result to an existing playlist."
                    />
                    <SidenavItem
                        label="Add to queue"
                        nodeType="addToQueue"
                        tooltip="Add the tracks to the playback queue."
                    />
                </ul>
            </div>
        </div>
    );
}
