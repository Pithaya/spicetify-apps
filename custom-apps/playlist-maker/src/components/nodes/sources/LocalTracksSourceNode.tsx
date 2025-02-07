import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import {
    LocalTracksDataSchema,
    type LocalTracksData,
} from 'custom-apps/playlist-maker/src/models/nodes/sources/local-tracks-source-processor';
import { setValueAsOptionalString } from 'custom-apps/playlist-maker/src/utils/form-utils';
import { getDefaultValueForNodeType } from 'custom-apps/playlist-maker/src/utils/node-utils';
import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { SelectController } from '../../inputs/SelectController';
import { TextInput } from '../../inputs/TextInput';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { NodeField } from '../shared/NodeField';
import { SourceNodeHeader } from '../shared/NodeHeader';
import { NodeTitle } from '../shared/NodeTitle';

const propertyValues: Record<LocalTracksData['sortField'], string> = {
    ALBUM: 'Album',
    ARTIST: 'Artist',
    TITLE: 'Name',
    DURATION: 'Duration',
    ADDED_AT: 'Added at',
    NO_SORT: 'No sort',
};

const orderValues: Record<LocalTracksData['sortOrder'], string> = {
    ASC: 'Ascending',
    DESC: 'Descending',
};

export function LocalTracksSourceNode(
    props: Readonly<NodeProps<LocalTracksData>>,
): JSX.Element {
    const { control, register, errors } = useNodeForm<LocalTracksData>(
        props.id,
        props.data,
        getDefaultValueForNodeType('localTracksSource'),
        LocalTracksDataSchema,
    );

    return (
        <Node isExecuting={props.data.isExecuting}>
            <SourceNodeHeader />
            <NodeContent>
                <NodeTitle title="Local tracks" />

                <NodeField
                    tooltip="Search filter to apply"
                    label="Filter"
                    error={errors.filter}
                >
                    <TextInput
                        placeholder="Search"
                        {...register('filter', {
                            setValueAs: setValueAsOptionalString,
                        })}
                    />
                </NodeField>

                <NodeField label="Sort by" error={errors.sortField}>
                    <SelectController
                        label="Property to sort on"
                        name="sortField"
                        control={control}
                        items={Object.entries(propertyValues).map(
                            ([key, label]) => ({
                                label,
                                value: key,
                            }),
                        )}
                    />
                </NodeField>
                <NodeField label="Order" error={errors.sortOrder}>
                    <SelectController
                        label="Sort order"
                        name="sortOrder"
                        control={control}
                        items={Object.entries(orderValues).map(
                            ([key, label]) => ({
                                label,
                                value: key,
                            }),
                        )}
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
