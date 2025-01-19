import React, { type DragEvent, type KeyboardEvent } from 'react';
import styles from './Sidebar.module.scss';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { type CustomNodeType } from '../../models/nodes/node-types';
import { useAppStore } from '../../stores/store';

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
                >
                    <TextComponent elementType="span">
                        {props.label}
                    </TextComponent>
                </button>
            </Spicetify.ReactComponent.TooltipWrapper>
        </li>
    );
}

export function Sidenav(): JSX.Element {
    return (
        <div className={styles['sidebar']}>
            <TextComponent elementType="h1">Sources</TextComponent>
            <hr />
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
                    label="Library playlist"
                    nodeType="libraryPlaylistSource"
                    tooltip="Get tracks from a playlist in your library."
                />
                <SidenavItem
                    label="Top tracks"
                    nodeType="topTracksSource"
                    tooltip="Get tracks from your top tracks."
                />
            </ul>

            <TextComponent elementType="h1">Filters</TextComponent>
            <hr />
            <ul>
                <SidenavItem
                    label="Genre"
                    nodeType="genre"
                    tooltip="Filter tracks by genre."
                />
                <SidenavItem
                    label="Is playable"
                    nodeType="isPlayable"
                    tooltip="Filter tracks that are playable."
                />
            </ul>

            <TextComponent
                elementType="h2"
                paddingBottom="0.5rem"
                weight="bold"
                fontSize="large"
                style={{ marginTop: '1rem' }}
            >
                Audio features
            </TextComponent>
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

            <TextComponent elementType="h1">Processing</TextComponent>
            <hr />
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

            <TextComponent elementType="h1">Result</TextComponent>
            <hr />
            <ul>
                <SidenavItem
                    label="Result"
                    nodeType="result"
                    tooltip="The workflow result."
                />
            </ul>
        </div>
    );
}
