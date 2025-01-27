import React from 'react';
import { Handle, type NodeProps, Position } from 'reactflow';
import {
    LocalTracksDataSchema,
    type LocalTracksData,
} from 'custom-apps/playlist-maker/src/models/nodes/sources/local-tracks-source-processor';
import { Node } from '../shared/Node';
import { SourceNodeHeader } from '../shared/NodeHeader';
import { NodeContent } from '../shared/NodeContent';
import { TextInput } from '../../inputs/TextInput';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import { NodeField } from '../shared/NodeField';
import { NodeTitle } from '../shared/NodeTitle';
import { setValueAsString } from 'custom-apps/playlist-maker/src/utils/form-utils';
import { SelectController } from '../../inputs/SelectController';

const defaultValues: LocalTracksData = {
    filter: undefined,
    sortField: 'DURATION',
    sortOrder: 'DESC',
    isExecuting: undefined,
};

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
        defaultValues,
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
                            setValueAs: setValueAsString,
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
