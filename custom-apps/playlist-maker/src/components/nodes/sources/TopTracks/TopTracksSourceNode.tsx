import React from 'react';
import { Handle, type NodeProps, Position } from 'reactflow';
import { NodeHeader } from '../../shared/NodeHeader';
import { Node } from '../../shared/Node';
import { NodeContent } from '../../shared/NodeContent';
import { NodeField } from '../../shared/NodeField';
import { numberValueSetter } from 'custom-apps/playlist-maker/src/utils/form-utils';
import { NumberInput } from '../../../inputs/NumberInput';
import { wholeNumber } from 'custom-apps/playlist-maker/src/utils/validation-utils';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import { type LocalNodeData } from 'custom-apps/playlist-maker/src/models/nodes/node-processor';
import { type TopTracksData } from 'custom-apps/playlist-maker/src/models/nodes/sources/top-tracks-source-processor';
import { Controller } from 'react-hook-form';
import { Select } from '@shared/components/inputs/Select/Select';
import { NodeTitle } from '../../shared/NodeTitle';

const defaultValues: LocalNodeData<TopTracksData> = {
    timeRange: 'short_term',
    offset: undefined,
    limit: undefined,
};

export function TopTracksSourceNode(
    props: Readonly<NodeProps<TopTracksData>>,
): JSX.Element {
    const { register, errors, control } = useNodeForm<TopTracksData>(
        props.id,
        props.data,
        defaultValues,
    );

    return (
        <Node isExecuting={props.data.isExecuting}>
            <NodeHeader
                label="Source"
                backgroundColor="cornflowerblue"
                textColor="black"
            />
            <NodeContent>
                <NodeTitle title="Top tracks" />

                <NodeField
                    label="Time range"
                    error={
                        errors.timeRange === undefined
                            ? undefined
                            : {
                                  type: 'validate',
                                  message: errors.timeRange.message,
                              }
                    }
                >
                    <Controller
                        name="timeRange"
                        control={control}
                        rules={{
                            validate: (v) =>
                                v === undefined
                                    ? 'This field is required'
                                    : true,
                        }}
                        render={({ field: { onChange, value } }) => (
                            <Select
                                selectLabel="Select a time range"
                                selectedValue={value ?? null}
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
                                onItemClicked={(item) => {
                                    onChange(item.value);
                                }}
                            />
                        )}
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
                            setValueAs: numberValueSetter,
                            min: {
                                value: 0,
                                message: 'The value must be greater than 0',
                            },
                            validate: {
                                whole: wholeNumber,
                            },
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
                            setValueAs: numberValueSetter,
                            min: {
                                value: 0,
                                message: 'The value must be greater than 0',
                            },
                            validate: {
                                whole: wholeNumber,
                            },
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
