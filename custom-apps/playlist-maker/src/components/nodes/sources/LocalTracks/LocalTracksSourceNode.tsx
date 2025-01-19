import React from 'react';
import { Handle, type NodeProps, Position } from 'reactflow';
import { type LocalTracksData } from 'custom-apps/playlist-maker/src/models/nodes/sources/local-tracks-source-processor';
import { Node } from '../../shared/Node';
import { SourceNodeHeader } from '../../shared/NodeHeader';
import { NodeContent } from '../../shared/NodeContent';
import { TextInput } from '../../../inputs/TextInput';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import { NodeField } from '../../shared/NodeField';
import { stringValueSetter } from 'custom-apps/playlist-maker/src/utils/form-utils';
import { type LocalNodeData } from 'custom-apps/playlist-maker/src/models/nodes/node-processor';
import { Controller } from 'react-hook-form';
import { Select } from '@shared/components/inputs/Select/Select';
import { NodeTitle } from '../../shared/NodeTitle';

const defaultValues: LocalNodeData<LocalTracksData> = {
    filter: undefined,
    sortField: 'DURATION',
    sortOrder: 'DESC',
};

const propertyValues: Record<LocalTracksData['sortField'], string> = {
    ALBUM: 'Album',
    ARTIST: 'Artist',
    TITLE: 'Name',
    DURATION: 'Duration',
    ADDED_AT: 'Added at',
    NO_SORT: 'No sort',
};

const orderValues: Record<LocalTracksData['sortOrder'], string> = {
    ASC: 'Ascending',
    DESC: 'Descending',
};

export function LocalTracksSourceNode(
    props: Readonly<NodeProps<LocalTracksData>>,
): JSX.Element {
    const { control, register, errors } = useNodeForm<LocalTracksData>(
        props.id,
        props.data,
        defaultValues,
    );

    return (
        <Node isExecuting={props.data.isExecuting}>
            <SourceNodeHeader />
            <NodeContent>
                <NodeTitle title="Local tracks" />

                <NodeField
                    tooltip="Search filter to apply"
                    label="Filter"
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
                                disabled={props.data.sortField === 'NO_SORT'}
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
