import type { Item } from '@shared/components/inputs/Select/Select';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import {
    SubsetDataSchema,
    type SubsetData,
} from 'custom-apps/playlist-maker/src/models/processors/processing/subset-processor';
import { getDefaultValueForNodeType } from 'custom-apps/playlist-maker/src/utils/node-utils';
import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { NumberController } from '../../inputs/NumberController';
import { SelectController } from '../../inputs/SelectController';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { NodeField } from '../shared/NodeField';
import { ProcessingNodeHeader } from '../shared/NodeHeader';
import { NodeTitle } from '../shared/NodeTitle';

const typeItems: Item<SubsetData['type']>[] = [
    { value: 'first', label: 'First' },
    { value: 'last', label: 'Last' },
];

export function SubsetNode(
    props: Readonly<NodeProps<SubsetData>>,
): JSX.Element {
    const { errors, control, updateNodeField } = useNodeForm<SubsetData>(
        props.id,
        props.data,
        getDefaultValueForNodeType('subset'),
        SubsetDataSchema,
    );

    return (
        <Node isExecuting={props.data.isExecuting} isSelected={props.selected}>
            <ProcessingNodeHeader />

            <NodeContent>
                <NodeTitle title="Subset" />

                <NodeField
                    label="Count"
                    tooltip="How many tracks to keep"
                    error={errors.count}
                >
                    <NumberController
                        placeholder="0"
                        control={control}
                        name="count"
                        onChange={(value) => {
                            updateNodeField({ count: value });
                        }}
                    />
                </NodeField>

                <NodeField
                    label="Position"
                    error={errors.type}
                    tooltip="Whether the first or last specified number of tracks should be kept"
                >
                    <SelectController
                        label="Position"
                        name="type"
                        control={control}
                        items={typeItems}
                        onChange={(value) => {
                            updateNodeField({
                                type: value,
                            });
                        }}
                    />
                </NodeField>
            </NodeContent>

            <Handle
                type="target"
                position={Position.Left}
                style={{ top: '42px' }}
            />
            <Handle
                type="source"
                position={Position.Right}
                style={{ top: '42px' }}
            />
        </Node>
    );
}
