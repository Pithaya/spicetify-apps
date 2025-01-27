import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import {
    EnergyDataSchema,
    MAX_ENERGY,
    MIN_ENERGY,
    type EnergyData,
} from 'custom-apps/playlist-maker/src/models/nodes/filter/energy-processor';
import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { SliderController } from '../../inputs/SliderController';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { FilterNodeHeader } from '../shared/NodeHeader';
import { NodeTitle } from '../shared/NodeTitle';

const defaultValues: EnergyData = {
    range: {
        min: MIN_ENERGY,
        max: MAX_ENERGY,
    },
    isExecuting: undefined,
};

export function EnergyNode(
    props: Readonly<NodeProps<EnergyData>>,
): JSX.Element {
    const { control } = useNodeForm<EnergyData>(
        props.id,
        props.data,
        defaultValues,
        EnergyDataSchema,
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
