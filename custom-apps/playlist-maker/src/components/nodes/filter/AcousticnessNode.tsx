import React from 'react';
import { Handle, type NodeProps, Position } from 'reactflow';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { NodeHeader } from '../shared/NodeHeader';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import { type LocalNodeData } from 'custom-apps/playlist-maker/src/models/nodes/node-processor';
import { type AcousticnessData } from 'custom-apps/playlist-maker/src/models/nodes/filter/acousticness-processor';
import { SliderController } from '../shared/SliderController';

const defaultValues: LocalNodeData<AcousticnessData> = {
    range: {
        min: 0,
        max: 1,
    },
};

export function AcousticnessNode(
    props: Readonly<NodeProps<AcousticnessData>>,
): JSX.Element {
    const { control } = useNodeForm<AcousticnessData>(
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
                    <TextComponent
                        elementType="p"
                        weight="bold"
                        paddingBottom="0"
                    >
                        Acousticness
                    </TextComponent>

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
