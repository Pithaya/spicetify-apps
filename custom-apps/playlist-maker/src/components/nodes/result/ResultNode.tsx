import React from 'react';
import { type NodeProps, Position, Handle } from 'reactflow';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { NodeHeader } from '../shared/NodeHeader';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { type BaseNodeData } from 'custom-apps/playlist-maker/src/models/nodes/node-processor';

export function ResultNode(
    props: Readonly<NodeProps<BaseNodeData>>,
): JSX.Element {
    return (
        <Node isExecuting={props.data.isExecuting}>
            <NodeHeader
                label="Result"
                backgroundColor="orange"
                textColor="black"
            />
            <NodeContent>
                <TextComponent paddingBottom="8px" weight="bold">
                    Final playlist
                </TextComponent>
            </NodeContent>
            <Handle
                type="target"
                position={Position.Left}
                id="input"
                style={{ top: '42px' }}
            />
        </Node>
    );
}
