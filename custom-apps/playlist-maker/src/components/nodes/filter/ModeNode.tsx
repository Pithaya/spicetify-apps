import React from 'react';
import { Handle, type NodeProps, Position } from 'reactflow';
import { NodeHeader } from '../shared/NodeHeader';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import { type LocalNodeData } from 'custom-apps/playlist-maker/src/models/nodes/node-processor';
import { NodeTitle } from '../shared/NodeTitle';
import type { ModeData } from 'custom-apps/playlist-maker/src/models/nodes/filter/mode-processor';
import { NodeField } from '../shared/NodeField';
import { Controller } from 'react-hook-form';
import { type Item, Select } from '@shared/components/inputs/Select/Select';

const defaultValues: LocalNodeData<ModeData> = {
    mode: '1',
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
    );

    return (
        <Node isExecuting={props.data.isExecuting}>
            <NodeHeader
                label="Filter"
                backgroundColor="violet"
                textColor="black"
            />
            <NodeContent>
                <NodeTitle title="Mode" />

                <NodeField
                    label="Mode"
                    error={
                        errors.mode === undefined
                            ? undefined
                            : {
                                  type: 'validate',
                                  message: errors.mode.message,
                              }
                    }
                >
                    <Controller
                        name="mode"
                        control={control}
                        rules={{
                            validate: (v) =>
                                v === undefined
                                    ? 'This field is required'
                                    : true,
                        }}
                        render={({ field: { onChange, value } }) => (
                            <Select
                                selectLabel="Mode"
                                selectedValue={value ?? null}
                                items={modes}
                                onItemClicked={(item) => {
                                    console.log(item);
                                    onChange(item.value);
                                }}
                            />
                        )}
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
