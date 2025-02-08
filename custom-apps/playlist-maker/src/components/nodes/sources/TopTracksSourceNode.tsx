import type { Item } from '@shared/components/inputs/Select/Select';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import {
    TopTracksDataSchema,
    type TopTracksData,
} from 'custom-apps/playlist-maker/src/models/nodes/sources/top-tracks-source-processor';
import { getDefaultValueForNodeType } from 'custom-apps/playlist-maker/src/utils/node-utils';
import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { NumberController } from '../../inputs/NumberController';
import { SelectController } from '../../inputs/SelectController';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { NodeField } from '../shared/NodeField';
import { SourceNodeHeader } from '../shared/NodeHeader';
import { NodeTitle } from '../shared/NodeTitle';

export function TopTracksSourceNode(
    props: Readonly<NodeProps<TopTracksData>>,
): JSX.Element {
    const { errors, control, updateNodeField } = useNodeForm<TopTracksData>(
        props.id,
        props.data,
        getDefaultValueForNodeType('topTracksSource'),
        TopTracksDataSchema,
    );

    const timeRangeItems: Item<TopTracksData['timeRange']>[] = [
        {
            label: 'Short term',
            value: 'short_term',
        },
        {
            label: 'Medium term',
            value: 'medium_term',
        },
        { label: 'Long term', value: 'long_term' },
    ];

    return (
        <Node isExecuting={props.data.isExecuting}>
            <SourceNodeHeader />
            <NodeContent>
                <NodeTitle title="Top tracks" />

                <NodeField label="Time range" error={errors.timeRange}>
                    <SelectController
                        label="Select a time range"
                        name="timeRange"
                        control={control}
                        items={timeRangeItems}
                        onChange={(value) => {
                            updateNodeField({ timeRange: value });
                        }}
                    />
                </NodeField>

                <NodeField
                    label="Offset"
                    tooltip="Number of elements to skip"
                    error={errors.offset}
                >
                    <NumberController
                        placeholder="0"
                        control={control}
                        name="offset"
                        onChange={(value) => {
                            updateNodeField({ offset: value });
                        }}
                    />
                </NodeField>

                <NodeField
                    label="Limit"
                    tooltip="Number of elements to take. Leave empty to take all elements."
                    error={errors.limit}
                >
                    <NumberController
                        placeholder="None"
                        control={control}
                        name="limit"
                        onChange={(value) => {
                            updateNodeField({ limit: value });
                        }}
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
