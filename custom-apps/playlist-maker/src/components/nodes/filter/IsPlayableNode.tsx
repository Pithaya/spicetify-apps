import React from 'react';
import { Handle, type NodeProps, Position } from 'reactflow';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { FilterNodeHeader } from '../shared/NodeHeader';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { type IsPlayableData } from 'custom-apps/playlist-maker/src/models/nodes/filter/is-playable-processor';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import { type LocalNodeData } from 'custom-apps/playlist-maker/src/models/nodes/node-processor';
import { NodeTitle } from '../shared/NodeTitle';

const defaultValues: LocalNodeData<IsPlayableData> = {
    isPlayable: true,
};

export function IsPlayableNode(
    props: Readonly<NodeProps<IsPlayableData>>,
): JSX.Element {
    const { register } = useNodeForm<IsPlayableData>(
        props.id,
        props.data,
        defaultValues,
    );

    return (
        <Node isExecuting={props.data.isExecuting}>
            <FilterNodeHeader />
            <NodeContent>
                <NodeTitle title="Is playable" />

                <label>
                    <TextComponent elementType="small">
                        Is playable ?
                    </TextComponent>
                    <input type="checkbox" {...register('isPlayable')} />
                </label>
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
