import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import {
    OrderByDataSchema,
    type OrderByData,
} from 'custom-apps/playlist-maker/src/models/nodes/processing/sort-processor';
import { getDefaultValueForNodeType } from 'custom-apps/playlist-maker/src/utils/node-utils';
import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { SelectController } from '../../inputs/SelectController';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { NodeField } from '../shared/NodeField';
import { ProcessingNodeHeader } from '../shared/NodeHeader';
import { NodeTitle } from '../shared/NodeTitle';

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
        getDefaultValueForNodeType('sort'),
        OrderByDataSchema,
    );

    return (
        <Node isExecuting={props.data.isExecuting}>
            <ProcessingNodeHeader />
            <NodeContent>
                <NodeTitle title="Sort" />

                <NodeField label="Property" error={errors.property}>
                    <SelectController
                        label="Property to sort on"
                        name="property"
                        control={control}
                        items={Object.entries(propertyValues).map(
                            ([key, label]) => ({
                                label,
                                value: key,
                            }),
                        )}
                    />
                </NodeField>
                <NodeField label="Order" error={errors.order}>
                    <SelectController
                        label="Sort order"
                        name="order"
                        control={control}
                        items={Object.entries(orderValues).map(
                            ([key, label]) => ({
                                label,
                                value: key,
                            }),
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
