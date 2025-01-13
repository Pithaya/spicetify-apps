import React from 'react';
import { Handle, type NodeProps, Position } from 'reactflow';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { NodeHeader } from '../shared/NodeHeader';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { type OrderByData } from 'custom-apps/playlist-maker/src/models/nodes/processing/sort-processor';
import { type LocalNodeData } from 'custom-apps/playlist-maker/src/models/nodes/node-processor';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import { NodeField } from '../shared/NodeField';
import { Controller } from 'react-hook-form';
import { Select } from '@shared/components/inputs/Select/Select';

const defaultValues: LocalNodeData<OrderByData> = {
    order: 'asc',
    property: 'name',
};

const propertyValues: Record<OrderByData['property'], string> = {
    album: 'Album',
    artist: 'Artist',
    name: 'Name',
    source: 'Source',
    duration: 'Duration',
};

const orderValues: Record<OrderByData['order'], string> = {
    asc: 'Ascending',
    desc: 'Descending',
};

export function SortProcessorNode(
    props: Readonly<NodeProps<OrderByData>>,
): JSX.Element {
    const { errors, control } = useNodeForm<OrderByData>(
        props.id,
        props.data,
        defaultValues,
    );

    return (
        <Node isExecuting={props.data.isExecuting}>
            <NodeHeader
                label="Processing"
                backgroundColor="greenyellow"
                textColor="black"
            />
            <NodeContent>
                <TextComponent paddingBottom="8px" weight="bold">
                    Sort
                </TextComponent>

                <NodeField
                    label="Property"
                    error={
                        errors.property === undefined
                            ? undefined
                            : {
                                  type: 'validate',
                                  message: errors.property.message,
                              }
                    }
                >
                    <Controller
                        name="property"
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
                        errors.order === undefined
                            ? undefined
                            : {
                                  type: 'validate',
                                  message: errors.order.message,
                              }
                    }
                >
                    <Controller
                        name="order"
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
