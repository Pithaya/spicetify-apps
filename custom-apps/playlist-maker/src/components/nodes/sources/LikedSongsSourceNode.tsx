import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import {
    LikedSongsDataSchema,
    type LikedSongsData,
} from 'custom-apps/playlist-maker/src/models/nodes/sources/liked-songs-source-processor';
import {
    setValueAsNumber,
    setValueAsString,
} from 'custom-apps/playlist-maker/src/utils/form-utils';
import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { NumberInput } from '../../inputs/NumberInput';
import { SelectController } from '../../inputs/SelectController';
import { TextInput } from '../../inputs/TextInput';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { NodeField } from '../shared/NodeField';
import { SourceNodeHeader } from '../shared/NodeHeader';
import { NodeTitle } from '../shared/NodeTitle';

const defaultValues: LikedSongsData = {
    filter: undefined,
    offset: undefined,
    limit: undefined,
    sortField: 'ADDED_AT',
    sortOrder: 'DESC',
    isExecuting: undefined,
};

const propertyValues: Record<LikedSongsData['sortField'], string> = {
    ADDED_AT: 'Added at',
    ALBUM_NAME: 'Album',
    ARTIST_NAME: 'Artist',
    NAME: 'Name',
};

const orderValues: Record<LikedSongsData['sortOrder'], string> = {
    ASC: 'Ascending',
    DESC: 'Descending',
};

export function LikedSongsSourceNode(
    props: Readonly<NodeProps<LikedSongsData>>,
): JSX.Element {
    const { control, register, errors } = useNodeForm<LikedSongsData>(
        props.id,
        props.data,
        defaultValues,
        LikedSongsDataSchema,
    );

    return (
        <Node isExecuting={props.data.isExecuting}>
            <SourceNodeHeader />
            <NodeContent>
                <NodeTitle title="Liked songs" />

                <NodeField
                    label="Filter"
                    tooltip="Search filter to apply"
                    error={errors.filter}
                >
                    <TextInput
                        placeholder="Search"
                        {...register('filter', {
                            setValueAs: setValueAsString,
                        })}
                    />
                </NodeField>

                <NodeField
                    label="Offset"
                    tooltip="Number of elements to skip"
                    error={errors.offset}
                >
                    <NumberInput
                        placeholder="0"
                        {...register('offset', {
                            setValueAs: setValueAsNumber,
                        })}
                    />
                </NodeField>

                <NodeField
                    label="Limit"
                    tooltip="Number of elements to take. Leave empty to take all elements."
                    error={errors.limit}
                >
                    <NumberInput
                        placeholder="None"
                        {...register('limit', {
                            setValueAs: setValueAsNumber,
                        })}
                    />
                </NodeField>

                <NodeField label="Sort by" error={errors.sortField}>
                    <SelectController
                        name="sortField"
                        control={control}
                        items={Object.entries(propertyValues).map(
                            ([key, label]) => ({
                                label,
                                value: key,
                            }),
                        )}
                        label="Property to sort on"
                    />
                </NodeField>
                <NodeField label="Order" error={errors.sortOrder}>
                    <SelectController
                        name="sortOrder"
                        control={control}
                        items={Object.entries(orderValues).map(
                            ([key, label]) => ({
                                label,
                                value: key,
                            }),
                        )}
                        label="Sort order"
                    />
                </NodeField>
            </NodeContent>
            <Handle
                type="source"
                position={Position.Right}
                id="result"
                style={{ top: '40px' }}
            />
        </Node>
    );
}
