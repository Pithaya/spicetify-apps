import React from 'react';
import styles from './GenreNode.module.scss';
import { Handle, type NodeProps, Position } from 'reactflow';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { NodeHeader } from '../shared/NodeHeader';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import genresJson from 'custom-apps/playlist-maker/src/assets/genres.json';
import { Chip } from '@shared/components/ui/Chip/Chip';
import { SpotifyIcon } from '@shared/components/ui/SpotifyIcon/SpotifyIcon';
import { ChevronDown } from 'lucide-react';
import useAppStore from 'custom-apps/playlist-maker/src/store/store';
import type { GenreFilterData } from 'custom-apps/playlist-maker/src/models/nodes/filter/genre-processor';

const genres: Record<string, string[]> = genresJson;

export function GenreNode(props: NodeProps<GenreFilterData>): JSX.Element {
    const updateNodeData = useAppStore((state) => state.updateNodeData);

    const menu = (
        <Spicetify.ReactComponent.Menu className={'main-contextMenu-menu'}>
            {Object.keys(genres).map((genre) => (
                <Spicetify.ReactComponent.MenuItem
                    key={genre}
                    onClick={() => {
                        if (props.data.genres.includes(genre)) {
                            updateNodeData<GenreFilterData>(props.id, {
                                genres: props.data.genres.filter(
                                    (g) => g !== genre,
                                ),
                            });
                        } else {
                            updateNodeData<GenreFilterData>(props.id, {
                                genres: [...props.data.genres, genre],
                            });
                        }
                    }}
                    leadingIcon={
                        props.data.genres.includes(genre) ? (
                            <SpotifyIcon
                                icon="check"
                                iconSize={12}
                                semanticColor="textBrightAccent"
                            />
                        ) : undefined
                    }
                >
                    <span>{genre}</span>
                </Spicetify.ReactComponent.MenuItem>
            ))}
        </Spicetify.ReactComponent.Menu>
    );

    return (
        <Node isExecuting={props.data.isExecuting}>
            <NodeHeader
                label="Filter"
                backgroundColor="violet"
                textColor="black"
            />
            <NodeContent>
                <TextComponent elementType="p" paddingBottom="1rem">
                    Genres
                </TextComponent>
                <div className={`${styles['chip-container']}`}>
                    {props.data.genres.map((genre) => (
                        <Chip
                            key={genre}
                            onClick={() => {
                                updateNodeData<GenreFilterData>(props.id, {
                                    genres: props.data.genres.filter(
                                        (g) => g !== genre,
                                    ),
                                });
                            }}
                            iconTrailing={() => (
                                <SpotifyIcon iconSize={12} icon="x" />
                            )}
                        >
                            <TextComponent fontSize={'x-small'}>
                                {genre}
                            </TextComponent>
                        </Chip>
                    ))}
                </div>

                <Spicetify.ReactComponent.ContextMenu
                    trigger="click"
                    action="toggle"
                    placement="bottom"
                    menu={menu}
                >
                    <div
                        className={`main-dropDown-dropDown ${styles['dropdown']} nodrag`}
                    >
                        <span>Select genres</span>
                        <ChevronDown size={14} />
                    </div>
                </Spicetify.ReactComponent.ContextMenu>
            </NodeContent>
            <Handle
                type="target"
                position={Position.Left}
                id="input"
                style={{ top: '42px' }}
            />
            <Handle
                type="source"
                position={Position.Right}
                id="input"
                style={{ top: '42px' }}
            />
        </Node>
    );
}
