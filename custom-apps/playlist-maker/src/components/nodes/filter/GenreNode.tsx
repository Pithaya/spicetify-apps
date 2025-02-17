import { MultiSelect } from '@shared/components/inputs/Select/MultiSelect';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import {
    GenreFilterDataSchema,
    type GenreFilterData,
} from 'custom-apps/playlist-maker/src/models/nodes/filter/genre-processor';
import { getDefaultValueForNodeType } from 'custom-apps/playlist-maker/src/utils/node-utils';
import React from 'react';
import { Controller } from 'react-hook-form';
import { Handle, Position, type NodeProps } from 'reactflow';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { NodeField } from '../shared/NodeField';
import { FilterNodeHeader } from '../shared/NodeHeader';
import { NodeTitle } from '../shared/NodeTitle';
import styles from './GenreNode.module.scss';

const genres: Record<string, string[]> = {};

export function GenreNode(
    props: Readonly<NodeProps<GenreFilterData>>,
): JSX.Element {
    const { errors, control, getValues } = useNodeForm<GenreFilterData>(
        props.id,
        props.data,
        getDefaultValueForNodeType('genre'),
        GenreFilterDataSchema,
    );

    return (
        <Node isExecuting={props.data.isExecuting} isSelected={props.selected}>
            <FilterNodeHeader />
            <NodeContent>
                <NodeTitle title="Genres" />

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
