import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import {
    EnergyDataSchema,
    MAX_ENERGY,
    MIN_ENERGY,
    type EnergyData,
} from 'custom-apps/playlist-maker/src/models/nodes/filter/energy-processor';
import { getDefaultValueForNodeType } from 'custom-apps/playlist-maker/src/utils/node-utils';
import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { SliderController } from '../../inputs/SliderController';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { FilterNodeHeader } from '../shared/NodeHeader';
import { NodeTitle } from '../shared/NodeTitle';

export function EnergyNode(
    props: Readonly<NodeProps<EnergyData>>,
): JSX.Element {
    const { control, updateNodeField } = useNodeForm<EnergyData>(
        props.id,
        props.data,
        getDefaultValueForNodeType('energy'),
        EnergyDataSchema,
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
                        title="Energy"
                        tooltip="Measure from 0.0 to 1.0 that represents a perceptual measure of intensity and activity. 
                        Typically, energetic tracks feel fast, loud, and noisy. 
                        For example, death metal has high energy, while a Bach prelude scores low on the scale."
                    />

                    <SliderController
                        control={control}
                        min={MIN_ENERGY}
                        max={MAX_ENERGY}
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
