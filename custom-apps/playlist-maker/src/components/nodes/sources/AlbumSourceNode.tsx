import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import {
    type AlbumData,
    AlbumDataSchema,
} from 'custom-apps/playlist-maker/src/models/nodes/sources/album-source-processor';
import { getDefaultValueForNodeType } from 'custom-apps/playlist-maker/src/utils/node-utils';
import React from 'react';
import { Handle, type NodeProps, Position } from 'reactflow';
import { CheckboxController } from '../../inputs/CheckboxController';
import { NumberController } from '../../inputs/NumberController';
import { TextController } from '../../inputs/TextController';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { NodeField } from '../shared/NodeField';
import { SourceNodeHeader } from '../shared/NodeHeader';
import { NodeTitle } from '../shared/NodeTitle';

export function AlbumSourceNode(
    props: Readonly<NodeProps<AlbumData>>,
): JSX.Element {
    const { errors, control, updateNodeField } = useNodeForm<AlbumData>(
        props.id,
        props.data,
        getDefaultValueForNodeType('albumSource'),
        AlbumDataSchema,
    );

    return (
        <Node isExecuting={props.data.isExecuting}>
            <SourceNodeHeader />
            <NodeContent>
                <NodeTitle title="Album" />

                <NodeField label="URI" tooltip="Album URI" error={errors.uri}>
                    <TextController
                        placeholder="URI"
                        control={control}
                        name="uri"
                        required={true}
                        onChange={(value) => {
                            updateNodeField({ uri: value });
                        }}
                    />
                </NodeField>

                <NodeField
                    label="Offset"
                    tooltip="Number of elements to skip"
                    error={errors.offset}
                >
                    <NumberController
                        placeholder="0"
                        control={control}
                        name="offset"
                        onChange={(value) => {
                            updateNodeField({ offset: value });
                        }}
                    />
                </NodeField>

                <NodeField
                    label="Limit"
                    tooltip="Number of elements to take. Leave empty to take all elements."
                    error={errors.limit}
                >
                    <NumberController
                        placeholder="None"
                        control={control}
                        name="limit"
                        onChange={(value) => {
                            updateNodeField({ limit: value });
                        }}
                    />
                </NodeField>

                <label>
                    <TextComponent elementType="small">
                        Only liked
                    </TextComponent>
                    <div className="flex justify-end">
                        <CheckboxController
                            control={control}
                            name="onlyLiked"
                            onChange={(value) => {
                                updateNodeField({ onlyLiked: value });
                            }}
                        />
                    </div>
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
