import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { LucideChevronDown } from 'lucide-react';
import React, {
    type DragEvent,
    type KeyboardEvent,
    type PropsWithChildren,
} from 'react';
import { type CustomNodeType } from '../../models/nodes/node-types';
import { useAppStore } from '../../stores/store';

type SidenavItemProps = {
    nodeType: CustomNodeType;
    label: string;
    tooltip: string;
};

function PlaceholderSidenavItem(
    props: Readonly<{ label: string }>,
): JSX.Element {
    return (
        <li>
            <Spicetify.ReactComponent.TooltipWrapper
                label="Coming soon"
                showDelay={100}
            >
                <li className="w-full cursor-not-allowed border-none bg-transparent !py-1 text-start opacity-50">
                    <TextComponent elementType="span" fontSize="medium">
                        {props.label}
                    </TextComponent>
                </li>
            </Spicetify.ReactComponent.TooltipWrapper>
        </li>
    );
}

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
                    className="hover:bg-spice-highlight hover:!text-spice-text w-full cursor-grab border-none bg-transparent !py-1 text-start"
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
        <details className="group">
            <summary className="flex cursor-pointer list-none items-center gap-1">
                <TextComponent
                    elementType="h2"
                    weight="bold"
                    fontSize="medium"
                    className="inline"
                >
                    {props.label}
                </TextComponent>
                <LucideChevronDown className="transition-transform group-open:rotate-180" />
            </summary>
            <div className="!mt-2">{props.children}</div>
        </details>
    );
}

function SidebarTitle(props: Readonly<{ label: string }>): JSX.Element {
    return (
        <>
            <TextComponent elementType="h1" fontSize="x-large">
                {props.label}
            </TextComponent>
            <hr className="divide-solid opacity-60" />
        </>
    );
}

export function Sidenav(): JSX.Element {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
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
                            label="Top tracks"
                            nodeType="topTracksSource"
                            tooltip="Get tracks from your top tracks."
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
            </div>

            <div className="flex flex-col gap-2">
                <SidebarTitle label="Filters" />

                <SidenavCollapsible label="Track property">
                    <ul>
                        <SidenavItem
                            label="Is playable"
                            nodeType="isPlayable"
                            tooltip="Filter tracks that are playable."
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

            <div className="flex flex-col gap-2">
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
                </ul>
            </div>

            <div className="flex flex-col gap-2">
                <SidebarTitle label="Result" />

                <ul>
                    <SidenavItem
                        label="Result"
                        nodeType="result"
                        tooltip="The workflow result."
                    />
                </ul>
            </div>
        </div>
    );
}
