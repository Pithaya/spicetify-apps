import React from 'react';
import { Handle, type NodeProps, Position } from 'reactflow';
import { NodeHeader } from '../shared/NodeHeader';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import { type LocalNodeData } from 'custom-apps/playlist-maker/src/models/nodes/node-processor';
import { SliderController } from '../shared/SliderController';
import type { SpeechinessData } from 'custom-apps/playlist-maker/src/models/nodes/filter/speechiness-processor';
import { NodeTitle } from '../shared/NodeTitle';

const defaultValues: LocalNodeData<SpeechinessData> = {
    range: {
        min: 0,
        max: 1,
    },
};

export function SpeechinessNode(
    props: Readonly<NodeProps<SpeechinessData>>,
): JSX.Element {
    const { control } = useNodeForm<SpeechinessData>(
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
                        title="Speechiness"
                        tooltip="Detects the presence of spoken words in a track. 
                        Values above 0.66 describe tracks that are probably made entirely of spoken words (e.g. talk show, audio book, poetry). 
                        Values below 0.33 most likely represent music and other non-speech-like tracks."
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
