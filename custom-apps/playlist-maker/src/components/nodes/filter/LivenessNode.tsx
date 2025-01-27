import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import {
    LivenessDataSchema,
    MAX_LIVENESS,
    MIN_LIVENESS,
    type LivenessData,
} from 'custom-apps/playlist-maker/src/models/nodes/filter/liveness-processor';
import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { SliderController } from '../../inputs/SliderController';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { FilterNodeHeader } from '../shared/NodeHeader';
import { NodeTitle } from '../shared/NodeTitle';

const defaultValues: LivenessData = {
    range: {
        min: MIN_LIVENESS,
        max: MAX_LIVENESS,
    },
    isExecuting: undefined,
};

export function LivenessNode(
    props: Readonly<NodeProps<LivenessData>>,
): JSX.Element {
    const { control } = useNodeForm<LivenessData>(
        props.id,
        props.data,
        defaultValues,
        LivenessDataSchema,
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
                        title="Liveness"
                        tooltip="Detects the presence of an audience in the recording. 
                        Higher liveness values represent an increased probability that the track was performed live. 
                        A value above 0.8 provides strong likelihood that the track is live."
                    />

                    <SliderController
                        control={control}
                        min={MIN_LIVENESS}
                        max={MAX_LIVENESS}
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
