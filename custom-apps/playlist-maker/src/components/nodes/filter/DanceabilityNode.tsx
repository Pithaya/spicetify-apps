import React from 'react';
import { Handle, type NodeProps, Position } from 'reactflow';
import { NodeHeader } from '../shared/NodeHeader';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import { type LocalNodeData } from 'custom-apps/playlist-maker/src/models/nodes/node-processor';
import { SliderController } from '../shared/SliderController';
import type { DanceabilityData } from 'custom-apps/playlist-maker/src/models/nodes/filter/danceability-processor';
import { NodeTitle } from '../shared/NodeTitle';

const defaultValues: LocalNodeData<DanceabilityData> = {
    range: {
        min: 0,
        max: 1,
    },
};

export function DanceabilityNode(
    props: Readonly<NodeProps<DanceabilityData>>,
): JSX.Element {
    const { control } = useNodeForm<DanceabilityData>(
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
                        title="Danceability"
                        tooltip="How suitable a track is for
                            dancing based on a combination of musical elements
                            including tempo, rhythm stability, beat strength, and
                            overall regularity. A value of 0.0 is least
                            danceable and 1.0 is most danceable."
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
