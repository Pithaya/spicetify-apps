import React from 'react';
import { Handle, type NodeProps, Position } from 'reactflow';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { type LocalTracksData } from 'custom-apps/playlist-maker/src/models/nodes/sources/local-tracks-source-processor';
import { Node } from '../../shared/Node';
import { NodeHeader } from '../../shared/NodeHeader';
import { NodeContent } from '../../shared/NodeContent';
import { TextInput } from '../../../inputs/TextInput';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import { NodeField } from '../../shared/NodeField';
import { stringValueSetter } from 'custom-apps/playlist-maker/src/utils/form-utils';
import { type LocalNodeData } from 'custom-apps/playlist-maker/src/models/nodes/node-processor';

const defaultValues: LocalNodeData<LocalTracksData> = {
    filter: undefined,
};

export function LocalTracksSourceNode(
    props: Readonly<NodeProps<LocalTracksData>>,
): JSX.Element {
    const { register, errors } = useNodeForm<LocalTracksData>(
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
                <TextComponent paddingBottom="8px" weight="bold">
                    Local tracks
                </TextComponent>

                <NodeField
                    tooltip="Search filter to apply"
                    label="Filter"
                    error={errors.filter}
                >
                    <TextInput
                        placeholder="Search"
                        {...register('filter', {
                            setValueAs: stringValueSetter,
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
