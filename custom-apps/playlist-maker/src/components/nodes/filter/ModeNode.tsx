import React from 'react';
import { Handle, type NodeProps, Position } from 'reactflow';
import { FilterNodeHeader } from '../shared/NodeHeader';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import { NodeTitle } from '../shared/NodeTitle';
import {
    ModeDataSchema,
    type ModeData,
} from 'custom-apps/playlist-maker/src/models/nodes/filter/mode-processor';
import { NodeField } from '../shared/NodeField';
import { type Item } from '@shared/components/inputs/Select/Select';
import { SelectController } from '../../inputs/SelectController';

const defaultValues: ModeData = {
    mode: '1',
    isExecuting: undefined,
};

const modes: Item[] = [
    { label: 'Major', value: '1' },
    { label: 'Minor', value: '0' },
];

export function ModeNode(props: Readonly<NodeProps<ModeData>>): JSX.Element {
    const { control, errors } = useNodeForm<ModeData>(
        props.id,
        props.data,
        defaultValues,
        ModeDataSchema,
    );

    return (
        <Node isExecuting={props.data.isExecuting}>
            <FilterNodeHeader />
            <NodeContent>
                <NodeTitle title="Mode" />

                <NodeField label="Mode" error={errors.mode}>
                    <SelectController
                        label="Mode"
                        name="mode"
                        control={control}
                        items={modes}
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
