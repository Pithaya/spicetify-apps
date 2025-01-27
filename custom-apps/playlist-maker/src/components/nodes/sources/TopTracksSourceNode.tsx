import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import {
    TopTracksDataSchema,
    type TopTracksData,
} from 'custom-apps/playlist-maker/src/models/nodes/sources/top-tracks-source-processor';
import { setValueAsOptionalNumber } from 'custom-apps/playlist-maker/src/utils/form-utils';
import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { NumberInput } from '../../inputs/NumberInput';
import { SelectController } from '../../inputs/SelectController';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { NodeField } from '../shared/NodeField';
import { SourceNodeHeader } from '../shared/NodeHeader';
import { NodeTitle } from '../shared/NodeTitle';

const defaultValues: TopTracksData = {
    timeRange: 'short_term',
    offset: undefined,
    limit: undefined,
    isExecuting: undefined,
};

export function TopTracksSourceNode(
    props: Readonly<NodeProps<TopTracksData>>,
): JSX.Element {
    const { register, errors, control } = useNodeForm<TopTracksData>(
        props.id,
        props.data,
        defaultValues,
        TopTracksDataSchema,
    );

    return (
        <Node isExecuting={props.data.isExecuting}>
            <SourceNodeHeader />
            <NodeContent>
                <NodeTitle title="Top tracks" />

                <NodeField label="Time range" error={errors.timeRange}>
                    <SelectController
                        label="Select a time range"
                        name="timeRange"
                        control={control}
                        items={[
                            {
                                label: 'Short term',
                                value: 'short_term',
                            },
                            {
                                label: 'Medium term',
                                value: 'medium_term',
                            },
                            { label: 'Long term', value: 'long_term' },
                        ]}
                    />
                </NodeField>

                <NodeField
                    label="Offset"
                    tooltip="Number of elements to skip"
                    error={errors.offset}
                >
                    <NumberInput
                        placeholder="0"
                        {...register('offset', {
                            setValueAs: setValueAsOptionalNumber,
                        })}
                    />
                </NodeField>

                <NodeField
                    label="Limit"
                    tooltip="Number of elements to take. Leave empty to take all elements."
                    error={errors.limit}
                >
                    <NumberInput
                        placeholder="None"
                        {...register('limit', {
                            setValueAs: setValueAsOptionalNumber,
                        })}
                    />
                </NodeField>
            </NodeContent>
            <Handle
                type="source"
                position={Position.Right}
                id="result"
                style={{ top: '40px' }}
            />
        </Node>
    );
}
