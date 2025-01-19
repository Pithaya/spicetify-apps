import React from 'react';
import { Handle, type NodeProps, Position } from 'reactflow';
import { type LikedSongsData } from 'custom-apps/playlist-maker/src/models/nodes/sources/liked-songs-source-processor';
import { NodeHeader } from '../../shared/NodeHeader';
import { Node } from '../../shared/Node';
import { NodeContent } from '../../shared/NodeContent';
import { TextInput } from '../../../inputs/TextInput';
import { NodeField } from '../../shared/NodeField';
import {
    numberValueSetter,
    stringValueSetter,
} from 'custom-apps/playlist-maker/src/utils/form-utils';
import { NumberInput } from '../../../inputs/NumberInput';
import { wholeNumber } from 'custom-apps/playlist-maker/src/utils/validation-utils';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import { type LocalNodeData } from 'custom-apps/playlist-maker/src/models/nodes/node-processor';
import { Controller } from 'react-hook-form';
import { Select } from '@shared/components/inputs/Select/Select';
import { NodeTitle } from '../../shared/NodeTitle';

const defaultValues: LocalNodeData<LikedSongsData> = {
    filter: undefined,
    offset: undefined,
    limit: undefined,
    sortField: 'ADDED_AT',
    sortOrder: 'DESC',
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
    );

    return (
        <Node isExecuting={props.data.isExecuting}>
            <NodeHeader
                label="Source"
                backgroundColor="cornflowerblue"
                textColor="black"
            />
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
                            setValueAs: stringValueSetter,
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
                            setValueAs: numberValueSetter,
                            min: {
                                value: 0,
                                message: 'The value must be greater than 0',
                            },
                            validate: {
                                whole: wholeNumber,
                            },
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
                            setValueAs: numberValueSetter,
                            min: {
                                value: 0,
                                message: 'The value must be greater than 0',
                            },
                            validate: {
                                whole: wholeNumber,
                            },
                        })}
                    />
                </NodeField>

                <NodeField
                    label="Sort by"
                    error={
                        errors.sortField === undefined
                            ? undefined
                            : {
                                  type: 'validate',
                                  message: errors.sortField.message,
                              }
                    }
                >
                    <Controller
                        name="sortField"
                        control={control}
                        rules={{
                            validate: (v) =>
                                v === undefined
                                    ? 'This field is required'
                                    : true,
                        }}
                        render={({ field: { onChange, value } }) => (
                            <Select
                                selectLabel="Property to sort on"
                                selectedValue={value ?? null}
                                items={Object.entries(propertyValues).map(
                                    ([key, label]) => ({
                                        label,
                                        value: key,
                                    }),
                                )}
                                onItemClicked={(item) => {
                                    onChange(item.value);
                                }}
                            />
                        )}
                    />
                </NodeField>
                <NodeField
                    label="Order"
                    error={
                        errors.sortOrder === undefined
                            ? undefined
                            : {
                                  type: 'validate',
                                  message: errors.sortOrder.message,
                              }
                    }
                >
                    <Controller
                        name="sortOrder"
                        control={control}
                        rules={{
                            validate: (v) =>
                                v === undefined
                                    ? 'This field is required'
                                    : true,
                        }}
                        render={({ field: { onChange, value } }) => (
                            <Select
                                selectLabel="Sort order"
                                selectedValue={value ?? null}
                                items={Object.entries(orderValues).map(
                                    ([key, label]) => ({
                                        label,
                                        value: key,
                                    }),
                                )}
                                onItemClicked={(item) => {
                                    onChange(item.value);
                                }}
                            />
                        )}
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
