import type { BaseNodeData } from 'custom-apps/playlist-maker/src/models/processors/base-node-processor';
import React from 'react';
import { Handle, type NodeProps, Position } from 'reactflow';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { ProcessingNodeHeader } from '../shared/NodeHeader';
import { NodeTitle } from '../shared/NodeTitle';

export function DifferenceNode(
    props: Readonly<NodeProps<BaseNodeData>>,
): JSX.Element {
    return (
        <Node isExecuting={props.data.isExecuting} isSelected={props.selected}>
            <ProcessingNodeHeader />
            <NodeContent>
                <NodeTitle
                    title="Difference"
                    tooltip="Keep only the tracks that are not in both inputs."
                />
                <p>First input</p>
                <p>Second input</p>
            </NodeContent>
            <Handle
                type="target"
                id="first-set"
                position={Position.Left}
                style={{ top: '78px' }}
            />
            <Handle
                type="target"
                id="second-set"
                position={Position.Left}
                style={{ top: '106px' }}
            />
            <Handle
                type="source"
                position={Position.Right}
                style={{ top: '42px' }}
            />
        </Node>
    );
}
