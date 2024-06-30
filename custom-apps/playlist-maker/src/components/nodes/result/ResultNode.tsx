import React from 'react';
import { type NodeProps, Position } from 'reactflow';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { SingleConnectionHandle } from '../shared/SingleConnectionHandle';
import { NodeHeader } from '../shared/NodeHeader';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { type BaseNodeData } from 'custom-apps/playlist-maker/src/models/nodes/node-processor';

export function ResultNode(props: NodeProps<BaseNodeData>): JSX.Element {
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
            <SingleConnectionHandle
                type="target"
                position={Position.Left}
                id="input"
                style={{ top: '42px' }}
            />
        </Node>
    );
}
