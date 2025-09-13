import { type Item } from '@shared/components/inputs/Select/Select';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import {
    ModeDataSchema,
    type Mode,
    type ModeData,
} from 'custom-apps/playlist-maker/src/models/processors/filter/mode-processor';
import { getDefaultValueForNodeType } from 'custom-apps/playlist-maker/src/utils/node-utils';
import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { SelectController } from '../../inputs/SelectController';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { NodeField } from '../shared/NodeField';
import { FilterNodeHeader } from '../shared/NodeHeader';
import { NodeTitle } from '../shared/NodeTitle';

const modes: Item<Mode>[] = [
    { label: 'Major', value: '1' },
    { label: 'Minor', value: '0' },
];

export function ModeNode(props: Readonly<NodeProps<ModeData>>): JSX.Element {
    const { control, errors, updateNodeField } = useNodeForm<ModeData>(
        props.id,
        props.data,
        getDefaultValueForNodeType('mode'),
        ModeDataSchema,
    );

    return (
        <Node isExecuting={props.data.isExecuting} isSelected={props.selected}>
            <FilterNodeHeader />
            <NodeContent>
                <NodeTitle
                    title="Mode"
                    tooltip="Mode indicates the modality (major or minor) of a track, the type of scale from which its melodic content is derived."
                />

                <NodeField label="Mode" error={errors.mode}>
                    <SelectController
                        label="Mode"
                        name="mode"
                        control={control}
                        items={modes}
                        onChange={(value) => {
                            updateNodeField({ mode: value });
                        }}
                    />
                </NodeField>
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
