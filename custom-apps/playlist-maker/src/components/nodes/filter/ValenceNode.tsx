import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import {
    MAX_VALENCE,
    MIN_VALENCE,
    ValenceDataSchema,
    type ValenceData,
} from 'custom-apps/playlist-maker/src/models/processors/filter/valence-processor';
import { getDefaultValueForNodeType } from 'custom-apps/playlist-maker/src/utils/node-utils';
import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { SliderController } from '../../inputs/SliderController';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { FilterNodeHeader } from '../shared/NodeHeader';
import { NodeTitle } from '../shared/NodeTitle';

export function ValenceNode(
    props: Readonly<NodeProps<ValenceData>>,
): JSX.Element {
    const { control, updateNodeField } = useNodeForm<ValenceData>(
        props.id,
        props.data,
        getDefaultValueForNodeType('valence'),
        ValenceDataSchema,
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
                        title="Valence"
                        tooltip="A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. 
                        Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric),
                        while tracks with low valence sound more negative (e.g. sad, depressed, angry)."
                    />

                    <SliderController
                        control={control}
                        min={MIN_VALENCE}
                        max={MAX_VALENCE}
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
