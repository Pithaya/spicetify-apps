import React from 'react';
import { Handle, type NodeProps, Position } from 'reactflow';
import { NodeHeader } from '../shared/NodeHeader';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import { type LocalNodeData } from 'custom-apps/playlist-maker/src/models/nodes/node-processor';
import { SliderController } from '../shared/SliderController';
import type { TempoData } from 'custom-apps/playlist-maker/src/models/nodes/filter/tempo-processor';
import { NodeTitle } from '../shared/NodeTitle';

const defaultValues: LocalNodeData<TempoData> = {
    range: {
        min: 0,
        max: 1000,
    },
};

export function TempoNode(props: Readonly<NodeProps<TempoData>>): JSX.Element {
    const { control } = useNodeForm<TempoData>(
        props.id,
        props.data,
        defaultValues,
    );

    return (
        <Node isExecuting={props.data.isExecuting}>
            <NodeHeader
                label="Filter"
                backgroundColor="violet"
                textColor="black"
            />
            <NodeContent>
                <div
                    style={{
                        paddingLeft: '8px',
                        paddingRight: '8px',
                        paddingBottom: '8px',
                    }}
                >
                    <NodeTitle
                        title="Tempo (BPM)"
                        tooltip="The overall estimated tempo of a track in beats per minute (BPM). 
                        In musical terminology, tempo is the speed or pace of a given piece and derives directly from the average beat duration."
                    />

                    <SliderController
                        control={control}
                        min={0}
                        max={1000}
                        step={1}
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
