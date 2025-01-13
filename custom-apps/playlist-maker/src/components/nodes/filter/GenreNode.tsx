import React from 'react';
import styles from './GenreNode.module.scss';
import { Handle, type NodeProps, Position } from 'reactflow';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { NodeHeader } from '../shared/NodeHeader';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import genresJson from 'custom-apps/playlist-maker/src/assets/genres.json';
import type { GenreFilterData } from 'custom-apps/playlist-maker/src/models/nodes/filter/genre-processor';
import { MultiSelect } from '@shared/components/inputs/Select/MultiSelect';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import { NodeField } from '../shared/NodeField';
import { Controller } from 'react-hook-form';
import { type LocalNodeData } from 'custom-apps/playlist-maker/src/models/nodes/node-processor';

const genres: Record<string, string[]> = genresJson;

const defaultValues: LocalNodeData<GenreFilterData> = {
    genreCategories: [],
};

export function GenreNode(
    props: Readonly<NodeProps<GenreFilterData>>,
): JSX.Element {
    const { errors, control, getValues } = useNodeForm<GenreFilterData>(
        props.id,
        props.data,
        defaultValues,
    );

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
                <div className={`${styles['genre-container']}`}>
                    {getValues('genreCategories').length > 0 && (
                        <TextComponent
                            elementType="small"
                            fontSize="small"
                            paddingBottom="1rem"
                        >
                            {getValues('genreCategories').join(', ')}
                        </TextComponent>
                    )}
                </div>

                <NodeField
                    label="Genres"
                    error={
                        errors.genreCategories === undefined
                            ? undefined
                            : {
                                  type: 'validate',
                                  message: errors.genreCategories.message,
                              }
                    }
                >
                    <Controller
                        name="genreCategories"
                        control={control}
                        rules={{
                            validate: (v) =>
                                v.length === 0
                                    ? 'This field is required'
                                    : true,
                        }}
                        render={({ field: { onChange, value } }) => (
                            <MultiSelect
                                selectLabel="Select genres"
                                items={Object.keys(genres).map((genre) => ({
                                    value: genre,
                                    label: genre,
                                }))}
                                selectedValues={value}
                                onItemClicked={(genre) => {
                                    if (value.includes(genre)) {
                                        onChange(
                                            value.filter((g) => g !== genre),
                                        );
                                    } else {
                                        onChange([...value, genre]);
                                    }
                                }}
                            />
                        )}
                    />
                </NodeField>
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
