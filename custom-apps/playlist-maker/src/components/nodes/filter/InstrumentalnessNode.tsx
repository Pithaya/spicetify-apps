import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import {
    InstrumentalnessDataSchema,
    MAX_INSTRUMENTALNESS,
    MIN_INSTRUMENTALNESS,
    type InstrumentalnessData,
} from 'custom-apps/playlist-maker/src/models/nodes/filter/instrumentalness-processor';
import { getDefaultValueForNodeType } from 'custom-apps/playlist-maker/src/utils/node-utils';
import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { SliderController } from '../../inputs/SliderController';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { FilterNodeHeader } from '../shared/NodeHeader';
import { NodeTitle } from '../shared/NodeTitle';

export function InstrumentalnessNode(
    props: Readonly<NodeProps<InstrumentalnessData>>,
): JSX.Element {
    const { control, updateNodeField } = useNodeForm<InstrumentalnessData>(
        props.id,
        props.data,
        getDefaultValueForNodeType('instrumentalness'),
        InstrumentalnessDataSchema,
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
                        title="Instrumentalness"
                        tooltip="Predicts whether a track contains no vocals.
                        Values above 0.5 are intended to represent instrumental tracks. 
                        The closer the instrumentalness value is to 1.0, the greater likelihood the track contains no vocal content."
                    />

                    <SliderController
                        control={control}
                        min={MIN_INSTRUMENTALNESS}
                        max={MAX_INSTRUMENTALNESS}
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
