import React from 'react';
import { Position } from 'reactflow';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { SingleConnectionHandle } from '../shared/SingleConnectionHandle';
import { NodeHeader } from '../shared/NodeHeader';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';

export function ResultNode(): JSX.Element {
    return (
        <Node>
            <NodeHeader
                label="Result"
                backgroundColor="orange"
                textColor="black"
            />
            <NodeContent>
                <TextComponent>Final playlist</TextComponent>
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