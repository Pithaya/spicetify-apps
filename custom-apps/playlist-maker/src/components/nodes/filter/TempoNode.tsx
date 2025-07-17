import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import {
    MAX_TEMPO,
    MIN_TEMPO,
    TempoDataSchema,
    type TempoData,
} from 'custom-apps/playlist-maker/src/models/nodes/filter/tempo-processor';
import { getDefaultValueForNodeType } from 'custom-apps/playlist-maker/src/utils/node-utils';
import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { SliderController } from '../../inputs/SliderController';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { FilterNodeHeader } from '../shared/NodeHeader';
import { NodeTitle } from '../shared/NodeTitle';

export function TempoNode(props: Readonly<NodeProps<TempoData>>): JSX.Element {
    const { control, updateNodeField } = useNodeForm<TempoData>(
        props.id,
        props.data,
        getDefaultValueForNodeType('tempo'),
        TempoDataSchema,
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
                        title="Tempo (BPM)"
                        tooltip="The overall estimated tempo of a track in beats per minute (BPM). 
                        In musical terminology, tempo is the speed or pace of a given piece and derives directly from the average beat duration."
                    />

                    <SliderController
                        control={control}
                        min={MIN_TEMPO}
                        max={MAX_TEMPO}
                        step={1}
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
