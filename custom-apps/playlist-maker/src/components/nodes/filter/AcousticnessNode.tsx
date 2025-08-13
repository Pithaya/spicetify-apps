import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import {
    AcousticnessDataSchema,
    MAX_ACOUSTICNESS,
    MIN_ACOUSTICNESS,
    type AcousticnessData,
} from 'custom-apps/playlist-maker/src/models/processors/filter/acousticness-processor';
import { getDefaultValueForNodeType } from 'custom-apps/playlist-maker/src/utils/node-utils';
import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { SliderController } from '../../inputs/SliderController';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { FilterNodeHeader } from '../shared/NodeHeader';
import { NodeTitle } from '../shared/NodeTitle';

export function AcousticnessNode(
    props: Readonly<NodeProps<AcousticnessData>>,
): JSX.Element {
    const { control, updateNodeField } = useNodeForm<AcousticnessData>(
        props.id,
        props.data,
        getDefaultValueForNodeType('acousticness'),
        AcousticnessDataSchema,
    );

    return (
        <Node isExecuting={props.data.isExecuting} isSelected={props.selected}>
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
                        title="Acousticness"
                        tooltip="A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 
                        1.0 represents high confidence the track is acoustic."
                    />

                    <SliderController
                        control={control}
                        min={MIN_ACOUSTICNESS}
                        max={MAX_ACOUSTICNESS}
                        step={0.01}
                        onChange={(value) => {
                            updateNodeField({ range: value });
                        }}
                    />
                </div>
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
