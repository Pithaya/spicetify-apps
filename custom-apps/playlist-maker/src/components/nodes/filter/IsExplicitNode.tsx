import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import {
    IsExplicitDataSchema,
    type IsExplicitData,
} from 'custom-apps/playlist-maker/src/models/processors/filter/is-explicit-processor';
import { getDefaultValueForNodeType } from 'custom-apps/playlist-maker/src/utils/node-utils';
import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { CheckboxController } from '../../inputs/CheckboxController';
import { Node } from '../shared/Node';
import { NodeCheckboxField } from '../shared/NodeCheckboxField';
import { NodeContent } from '../shared/NodeContent';
import { FilterNodeHeader } from '../shared/NodeHeader';
import { NodeTitle } from '../shared/NodeTitle';

export function IsExplicitNode(
    props: Readonly<NodeProps<IsExplicitData>>,
): JSX.Element {
    const { control, updateNodeField, errors } = useNodeForm<IsExplicitData>(
        props.id,
        props.data,
        getDefaultValueForNodeType('isExplicit'),
        IsExplicitDataSchema,
    );

    return (
        <Node isExecuting={props.data.isExecuting} isSelected={props.selected}>
            <FilterNodeHeader />
            <NodeContent>
                <NodeTitle title="Is explicit" />

                <NodeCheckboxField
                    label="Is explicit ?"
                    error={errors.isExplicit}
                >
                    <CheckboxController
                        control={control}
                        name="isExplicit"
                        onChange={(value) => {
                            updateNodeField({ isExplicit: value });
                        }}
                    />
                </NodeCheckboxField>
            </NodeContent>
            <Handle
                type="target"
                position={Position.Left}
                style={{ top: '42px' }}
            />
            <Handle
                type="source"
                position={Position.Right}
                style={{ top: '42px' }}
            />
        </Node>
    );
}
