import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import {
    DurationDataSchema,
    type DurationData,
} from 'custom-apps/playlist-maker/src/models/processors/filter/duration-processor';
import { getDefaultValueForNodeType } from 'custom-apps/playlist-maker/src/utils/node-utils';
import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { NumberController } from '../../inputs/NumberController';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { NodeField } from '../shared/NodeField';
import { FilterNodeHeader } from '../shared/NodeHeader';
import { NodeTitle } from '../shared/NodeTitle';

export function DurationNode(
    props: Readonly<NodeProps<DurationData>>,
): JSX.Element {
    const { control, errors, updateNodeField } = useNodeForm<DurationData>(
        props.id,
        props.data,
        getDefaultValueForNodeType('duration'),
        DurationDataSchema,
    );

    return (
        <Node isExecuting={props.data.isExecuting} isSelected={props.selected}>
            <FilterNodeHeader />
            <NodeContent>
                <NodeTitle title="Duration" />

                <NodeField
                    label="Minimum duration"
                    tooltip="Duration in minutes"
                    error={errors.minDuration}
                >
                    <NumberController
                        control={control}
                        placeholder="None"
                        name="minDuration"
                        onChange={(value) => {
                            updateNodeField({ minDuration: value });
                        }}
                    />
                </NodeField>

                <NodeField
                    label="Maximum duration"
                    tooltip="Duration in minutes"
                    error={errors.maxDuration}
                >
                    <NumberController
                        control={control}
                        placeholder="None"
                        name="maxDuration"
                        onChange={(value) => {
                            updateNodeField({ maxDuration: value });
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
