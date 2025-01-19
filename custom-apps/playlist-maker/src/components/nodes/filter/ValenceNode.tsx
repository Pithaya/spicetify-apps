import React from 'react';
import { Handle, type NodeProps, Position } from 'reactflow';
import { NodeHeader } from '../shared/NodeHeader';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import { type LocalNodeData } from 'custom-apps/playlist-maker/src/models/nodes/node-processor';
import { SliderController } from '../shared/SliderController';
import type { ValenceData } from 'custom-apps/playlist-maker/src/models/nodes/filter/valence-processor';
import { NodeTitle } from '../shared/NodeTitle';

const defaultValues: LocalNodeData<ValenceData> = {
    range: {
        min: 0,
        max: 1,
    },
};

export function ValenceNode(
    props: Readonly<NodeProps<ValenceData>>,
): JSX.Element {
    const { control } = useNodeForm<ValenceData>(
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
                        title="Valence"
                        tooltip="A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. 
                        Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric),
                        while tracks with low valence sound more negative (e.g. sad, depressed, angry)."
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
