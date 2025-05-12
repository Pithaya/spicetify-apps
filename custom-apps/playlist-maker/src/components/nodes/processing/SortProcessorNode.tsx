import type { Item } from '@shared/components/inputs/Select/Select';
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

const propertyItems: Item<OrderByData['property']>[] = [
    { value: 'album', label: 'Album' },
    { value: 'artist', label: 'Artist' },
    { value: 'name', label: 'Name' },
    { value: 'source', label: 'Source' },
    { value: 'duration', label: 'Duration' },
];

const orderItems: Item<OrderByData['order']>[] = [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' },
];

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
        <Node isExecuting={props.data.isExecuting} isSelected={props.selected}>
            <ProcessingNodeHeader />
            <NodeContent>
                <NodeTitle title="Sort" />

                <NodeField label="Property" error={errors.property}>
                    <SelectController
                        label="Property to sort on"
                        name="property"
                        control={control}
                        items={propertyItems}
                    />
                </NodeField>
                <NodeField label="Order" error={errors.order}>
                    <SelectController
                        label="Sort order"
                        name="order"
                        control={control}
                        items={orderItems}
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
