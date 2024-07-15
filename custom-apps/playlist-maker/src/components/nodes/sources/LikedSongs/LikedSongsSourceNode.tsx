import React from 'react';
import { Handle, type NodeProps, Position } from 'reactflow';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { type LikedSongsData } from 'custom-apps/playlist-maker/src/models/nodes/sources/liked-songs-source-processor';
import { NodeHeader } from '../../shared/NodeHeader';
import { Node } from '../../shared/Node';
import { NodeContent } from '../../shared/NodeContent';
import { TextInput } from '../../../inputs/TextInput';
import { NodeField } from '../../shared/NodeField';
import {
    numberValueSetter,
    stringValueSetter,
} from 'custom-apps/playlist-maker/src/utils/form-utils';
import { NumberInput } from '../../../inputs/NumberInput';
import { wholeNumber } from 'custom-apps/playlist-maker/src/utils/validation-utils';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import { type BaseNodeData } from 'custom-apps/playlist-maker/src/models/nodes/node-processor';

export function LikedSongsSourceNode(
    props: Readonly<NodeProps<BaseNodeData>>,
): JSX.Element {
    const { register, errors } = useNodeForm<LikedSongsData>(props.id, {
        filter: undefined,
        offset: undefined,
        limit: undefined,
    });

    return (
        <Node isExecuting={props.data.isExecuting}>
            <NodeHeader
                label="Source"
                backgroundColor="cornflowerblue"
                textColor="black"
            />
            <NodeContent>
                <TextComponent paddingBottom="8px" weight="bold">
                    Liked songs
                </TextComponent>

                <NodeField
                    label="Filter"
                    tooltip="Search filter to apply"
                    error={errors.filter}
                >
                    <TextInput
                        placeholder="Search"
                        {...register('filter', {
                            setValueAs: stringValueSetter,
                        })}
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
