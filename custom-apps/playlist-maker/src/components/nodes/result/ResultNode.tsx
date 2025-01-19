import React from 'react';
import { type NodeProps, Position, Handle } from 'reactflow';
import { NodeHeader } from '../shared/NodeHeader';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { type BaseNodeData } from 'custom-apps/playlist-maker/src/models/nodes/node-processor';
import { NodeTitle } from '../shared/NodeTitle';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import useAppStore from 'custom-apps/playlist-maker/src/stores/store';
import { useShallow } from 'zustand/react/shallow';

export function ResultNode(
    props: Readonly<NodeProps<BaseNodeData>>,
): JSX.Element {
    const { result } = useAppStore(
        useShallow((state) => ({
            result: state.result,
        })),
    );

    return (
        <Node isExecuting={props.data.isExecuting}>
            <NodeHeader
                label="Result"
                backgroundColor="orange"
                textColor="black"
            />
            <NodeContent>
                <NodeTitle title="Final playlist" />

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}
                >
                    <TextComponent elementType="p">
                        Number of tracks in result:
                    </TextComponent>
                    {result.length === 0 && (
                        <TextComponent elementType="p">-</TextComponent>
                    )}
                    {result.length !== 0 && (
                        <TextComponent
                            elementType="p"
                            weight="bold"
                            paddingBottom="0"
                        >
                            {result.length}
                        </TextComponent>
                    )}
                </div>
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
