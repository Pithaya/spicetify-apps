import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import {
    ReleaseDateDataSchema,
    type ReleaseDateData,
} from 'custom-apps/playlist-maker/src/models/nodes/filter/release-date-processor';
import { getDefaultValueForNodeType } from 'custom-apps/playlist-maker/src/utils/node-utils';
import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { DateController } from '../../inputs/DateController';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { NodeField } from '../shared/NodeField';
import { FilterNodeHeader } from '../shared/NodeHeader';
import { NodeTitle } from '../shared/NodeTitle';

export function ReleaseDateNode(
    props: Readonly<NodeProps<ReleaseDateData>>,
): JSX.Element {
    const { control, errors, updateNodeField } = useNodeForm<ReleaseDateData>(
        props.id,
        props.data,
        getDefaultValueForNodeType('releaseDate'),
        ReleaseDateDataSchema,
    );

    return (
        <Node isExecuting={props.data.isExecuting} isSelected={props.selected}>
            <FilterNodeHeader />
            <NodeContent>
                <NodeTitle title="Album release date" />
                <NodeField label="Minimum date" error={errors.minDate}>
                    <DateController
                        control={control}
                        placeholder="Minimum date"
                        name="minDate"
                        onChange={(value) => {
                            updateNodeField({ minDate: value });
                        }}
                    />
                </NodeField>

                <NodeField label="Maximum date" error={errors.maxDate}>
                    <DateController
                        control={control}
                        placeholder="Maximum date"
                        name="maxDate"
                        onChange={(value) => {
                            updateNodeField({ maxDate: value });
                        }}
                    />
                </NodeField>
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
