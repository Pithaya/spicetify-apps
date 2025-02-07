import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import {
    IsPlayableDataSchema,
    type IsPlayableData,
} from 'custom-apps/playlist-maker/src/models/nodes/filter/is-playable-processor';
import { getDefaultValueForNodeType } from 'custom-apps/playlist-maker/src/utils/node-utils';
import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { FilterNodeHeader } from '../shared/NodeHeader';
import { NodeTitle } from '../shared/NodeTitle';

export function IsPlayableNode(
    props: Readonly<NodeProps<IsPlayableData>>,
): JSX.Element {
    const { register } = useNodeForm<IsPlayableData>(
        props.id,
        props.data,
        getDefaultValueForNodeType('isPlayable'),
        IsPlayableDataSchema,
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
