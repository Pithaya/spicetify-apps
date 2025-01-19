import React from 'react';
import { Handle, type NodeProps, Position } from 'reactflow';
import { FilterNodeHeader } from '../shared/NodeHeader';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import { type LocalNodeData } from 'custom-apps/playlist-maker/src/models/nodes/node-processor';
import { SliderController } from '../shared/SliderController';
import type { InstrumentalnessData } from 'custom-apps/playlist-maker/src/models/nodes/filter/instrumentalness-processor';
import { NodeTitle } from '../shared/NodeTitle';

const defaultValues: LocalNodeData<InstrumentalnessData> = {
    range: {
        min: 0,
        max: 1,
    },
};

export function InstrumentalnessNode(
    props: Readonly<NodeProps<InstrumentalnessData>>,
): JSX.Element {
    const { control } = useNodeForm<InstrumentalnessData>(
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
                        title="Instrumentalness"
                        tooltip="Predicts whether a track contains no vocals.
                        Values above 0.5 are intended to represent instrumental tracks. 
                        The closer the instrumentalness value is to 1.0, the greater likelihood the track contains no vocal content."
                    />

                    <SliderController
                        control={control}
                        min={0}
                        max={1}
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
