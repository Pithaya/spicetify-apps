import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { type BaseNodeData } from 'custom-apps/playlist-maker/src/models/nodes/node-processor';
import useAppStore from 'custom-apps/playlist-maker/src/stores/store';
import React from 'react';
import { Handle, type NodeProps, Position } from 'reactflow';
import { useShallow } from 'zustand/react/shallow';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { NodeHeader } from '../shared/NodeHeader';
import { NodeTitle } from '../shared/NodeTitle';

export function ResultNode(
    props: Readonly<NodeProps<BaseNodeData>>,
): JSX.Element {
    const { result } = useAppStore(
        useShallow((state) => ({
            result: state.result,
        })),
    );

    return (
        <Node isExecuting={props.data.isExecuting} isSelected={props.selected}>
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
                style={{ top: '42px' }}
            />
        </Node>
    );
}
