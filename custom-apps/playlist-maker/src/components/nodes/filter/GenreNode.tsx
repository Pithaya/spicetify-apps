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
import useAppStore from 'custom-apps/playlist-maker/src/store/store';
import type { GenreFilterData } from 'custom-apps/playlist-maker/src/models/nodes/filter/genre-processor';
import { MultiSelect } from '@shared/components/inputs/Select/MultiSelect';

const genres: Record<string, string[]> = genresJson;

export function GenreNode(props: NodeProps<GenreFilterData>): JSX.Element {
    const updateNodeData = useAppStore((state) => state.updateNodeData);

    return (
        <Node isExecuting={props.data.isExecuting}>
            <NodeHeader
                label="Filter"
                backgroundColor="violet"
                textColor="black"
            />
            <NodeContent>
                <TextComponent
                    elementType="p"
                    paddingBottom="1rem"
                    weight="bold"
                >
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

                <MultiSelect
                    selectLabel="Select genres"
                    items={Object.keys(genres).map((genre) => ({
                        id: genre,
                        label: genre,
                    }))}
                    selectedItems={props.data.genres}
                    onItemClicked={(genre) => {
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
                />
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
