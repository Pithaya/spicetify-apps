import React from 'react';
import { Handle, type NodeProps, Position } from 'reactflow';
import { SourceNodeHeader } from '../shared/NodeHeader';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { TextInput } from '../../inputs/TextInput';
import { NodeField } from '../shared/NodeField';
import {
    numberValueSetter,
    stringValueSetter,
} from 'custom-apps/playlist-maker/src/utils/form-utils';
import { NumberInput } from '../../inputs/NumberInput';
import { wholeNumber } from 'custom-apps/playlist-maker/src/utils/validation-utils';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import { type LocalNodeData } from 'custom-apps/playlist-maker/src/models/nodes/node-processor';
import { NodeTitle } from '../shared/NodeTitle';
import { type AlbumData } from 'custom-apps/playlist-maker/src/models/nodes/sources/album-source-processor';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';

const defaultValues: LocalNodeData<AlbumData> = {
    uri: undefined,
    limit: undefined,
    offset: undefined,
    onlyLiked: false,
};

export function AlbumSourceNode(
    props: Readonly<NodeProps<AlbumData>>,
): JSX.Element {
    const { register, errors } = useNodeForm<AlbumData>(
        props.id,
        props.data,
        defaultValues,
    );

    return (
        <Node isExecuting={props.data.isExecuting}>
            <SourceNodeHeader />
            <NodeContent>
                <NodeTitle title="Album" />

                <NodeField label="URI" tooltip="Album URI" error={errors.uri}>
                    <TextInput
                        placeholder="URI"
                        {...register('uri', {
                            setValueAs: stringValueSetter,
                            required: 'This field is required',
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

                <label>
                    <TextComponent elementType="small">
                        Only liked
                    </TextComponent>
                    <input type="checkbox" {...register('onlyLiked')} />
                </label>
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
