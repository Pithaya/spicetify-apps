import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import {
    DanceabilityDataSchema,
    MAX_DANCEABILITY,
    MIN_DANCEABILITY,
    type DanceabilityData,
} from 'custom-apps/playlist-maker/src/models/nodes/filter/danceability-processor';
import { getDefaultValueForNodeType } from 'custom-apps/playlist-maker/src/utils/node-utils';
import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { SliderController } from '../../inputs/SliderController';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { FilterNodeHeader } from '../shared/NodeHeader';
import { NodeTitle } from '../shared/NodeTitle';

export function DanceabilityNode(
    props: Readonly<NodeProps<DanceabilityData>>,
): JSX.Element {
    const { control, updateNodeField } = useNodeForm<DanceabilityData>(
        props.id,
        props.data,
        getDefaultValueForNodeType('danceability'),
        DanceabilityDataSchema,
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
                        title="Danceability"
                        tooltip="How suitable a track is for
                            dancing based on a combination of musical elements
                            including tempo, rhythm stability, beat strength, and
                            overall regularity. A value of 0.0 is least
                            danceable and 1.0 is most danceable."
                    />

                    <SliderController
                        control={control}
                        min={MIN_DANCEABILITY}
                        max={MAX_DANCEABILITY}
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
