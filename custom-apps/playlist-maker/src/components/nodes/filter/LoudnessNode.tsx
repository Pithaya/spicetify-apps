import React from 'react';
import { Handle, type NodeProps, Position } from 'reactflow';
import { FilterNodeHeader } from '../shared/NodeHeader';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import { type LocalNodeData } from 'custom-apps/playlist-maker/src/models/nodes/node-processor';
import { SliderController } from '../shared/SliderController';
import type { LoudnessData } from 'custom-apps/playlist-maker/src/models/nodes/filter/loudness-processor';
import { NodeTitle } from '../shared/NodeTitle';

const defaultValues: LocalNodeData<LoudnessData> = {
    range: {
        min: -60,
        max: 10,
    },
};

export function LoudnessNode(
    props: Readonly<NodeProps<LoudnessData>>,
): JSX.Element {
    const { control } = useNodeForm<LoudnessData>(
        props.id,
        props.data,
        defaultValues,
    );

    return (
        <Node isExecuting={props.data.isExecuting}>
            <FilterNodeHeader />
            <NodeContent>
                <div
                    style={{
                        paddingLeft: '8px',
                        paddingRight: '8px',
                        paddingBottom: '8px',
                    }}
                >
                    <NodeTitle
                        title="Loudness"
                        tooltip="The overall loudness of a track in decibels (dB). 
                        Loudness values are averaged across the entire track and are useful for comparing relative loudness of tracks."
                    />

                    <SliderController
                        control={control}
                        min={-60}
                        max={10}
                        step={0.01}
                    />
                </div>
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
