import React from 'react';
import { Handle, type NodeProps, Position } from 'reactflow';
import { NodeHeader } from '../shared/NodeHeader';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { type BaseNodeData } from 'custom-apps/playlist-maker/src/models/nodes/node-processor';
import { NodeTitle } from '../shared/NodeTitle';

export function DeduplicateNode(
    props: Readonly<NodeProps<BaseNodeData>>,
): JSX.Element {
    return (
        <Node isExecuting={props.data.isExecuting}>
            <NodeHeader
                label="Processing"
                backgroundColor="greenyellow"
                textColor="black"
            />
            <NodeContent>
                <NodeTitle title="Deduplicate" />
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
