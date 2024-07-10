import React, { type DragEvent, type KeyboardEvent } from 'react';
import styles from './Sidebar.module.scss';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { type CustomNodeType } from '../../models/nodes/node-types';
import { useAppStore } from '../../store/store';

type SidenavItemProps = {
    nodeType: CustomNodeType;
    label: string;
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
                <TextComponent elementType="span">{props.label}</TextComponent>
            </button>
        </li>
    );
}

export function Sidenav(): JSX.Element {
    return (
        <div className={styles['sidebar']}>
            <TextComponent elementType="h1">Sources</TextComponent>
            <hr />
            <ul>
                <SidenavItem label="Liked songs" nodeType="likedSongsSource" />
                <SidenavItem label="Local files" nodeType="localTracksSource" />
                <SidenavItem
                    label="Library playlist"
                    nodeType="libraryPlaylistSource"
                />
            </ul>

            <TextComponent elementType="h1">Filters</TextComponent>
            <hr />
            <ul>
                <SidenavItem label="Genre" nodeType="genre" />
            </ul>

            <TextComponent elementType="h1">Processing</TextComponent>
            <hr />
            <ul>
                <SidenavItem label="Deduplicate" nodeType="deduplicate" />
                <SidenavItem label="Shuffle" nodeType="shuffle" />
            </ul>

            <TextComponent elementType="h1">Result</TextComponent>
            <hr />
            <ul>
                <SidenavItem label="Result" nodeType="result" />
            </ul>
        </div>
    );
}
