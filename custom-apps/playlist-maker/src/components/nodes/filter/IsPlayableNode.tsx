import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import {
    IsPlayableDataSchema,
    type IsPlayableData,
} from 'custom-apps/playlist-maker/src/models/nodes/filter/is-playable-processor';
import { getDefaultValueForNodeType } from 'custom-apps/playlist-maker/src/utils/node-utils';
import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { CheckboxController } from '../../inputs/CheckboxController';
import { Node } from '../shared/Node';
import { NodeCheckboxField } from '../shared/NodeCheckboxField';
import { NodeContent } from '../shared/NodeContent';
import { FilterNodeHeader } from '../shared/NodeHeader';
import { NodeTitle } from '../shared/NodeTitle';

export function IsPlayableNode(
    props: Readonly<NodeProps<IsPlayableData>>,
): JSX.Element {
    const { control, updateNodeField, errors } = useNodeForm<IsPlayableData>(
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

                <NodeCheckboxField
                    label="Is playable ?"
                    error={errors.isPlayable}
                >
                    <CheckboxController
                        control={control}
                        name="isPlayable"
                        onChange={(value) => {
                            updateNodeField({ isPlayable: value });
                        }}
                    />
                </NodeCheckboxField>
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
