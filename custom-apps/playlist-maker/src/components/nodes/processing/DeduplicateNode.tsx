import React from 'react';
import { Handle, Position } from 'reactflow';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { NodeHeader } from '../shared/NodeHeader';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';

export function DeduplicateNode(): JSX.Element {
    return (
        <Node>
            <NodeHeader
                label="Processing"
                backgroundColor="greenyellow"
                textColor="black"
            />
            <NodeContent>
                <TextComponent>Deduplicate</TextComponent>
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
