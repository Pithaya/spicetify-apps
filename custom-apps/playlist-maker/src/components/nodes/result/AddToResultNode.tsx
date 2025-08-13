import type { BaseNodeData } from 'custom-apps/playlist-maker/src/models/processors/base-node-processor';
import React from 'react';
import { Handle, type NodeProps, Position } from 'reactflow';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { ResultNodeHeader } from '../shared/NodeHeader';
import { NodeTitle } from '../shared/NodeTitle';

export function AddToResultNode(
    props: Readonly<NodeProps<BaseNodeData>>,
): JSX.Element {
    return (
        <Node isExecuting={props.data.isExecuting} isSelected={props.selected}>
            <ResultNodeHeader />

            <NodeContent>
                <NodeTitle
                    title="Add to result tab"
                    tooltip="Add the tracks to the result tab. They can then be played directly or a new playlist can be created from the tracks."
                />
            </NodeContent>
            <Handle
                type="target"
                position={Position.Left}
                style={{ top: '42px' }}
            />
        </Node>
    );
}
