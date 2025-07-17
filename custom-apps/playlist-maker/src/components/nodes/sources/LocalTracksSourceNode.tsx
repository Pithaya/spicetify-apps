import { type Item } from '@shared/components/inputs/Select/Select';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import {
    LocalTracksDataSchema,
    type LocalTracksData,
} from 'custom-apps/playlist-maker/src/models/nodes/sources/local-tracks-source-processor';
import { getDefaultValueForNodeType } from 'custom-apps/playlist-maker/src/utils/node-utils';
import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { SelectController } from '../../inputs/SelectController';
import { TextController } from '../../inputs/TextController';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { NodeField } from '../shared/NodeField';
import { SourceNodeHeader } from '../shared/NodeHeader';
import { NodeTitle } from '../shared/NodeTitle';

const propertyItems: Item<LocalTracksData['sortField']>[] = [
    {
        label: 'Album',
        value: 'ALBUM',
    },
    {
        label: 'Artist',
        value: 'ARTIST',
    },
    {
        label: 'Name',
        value: 'TITLE',
    },
    {
        label: 'Duration',
        value: 'DURATION',
    },
    {
        label: 'Added at',
        value: 'ADDED_AT',
    },
    {
        label: 'No sort',
        value: 'NO_SORT',
    },
];

const orderItems: Item<LocalTracksData['sortOrder']>[] = [
    {
        label: 'Ascending',
        value: 'ASC',
    },
    {
        label: 'Descending',
        value: 'DESC',
    },
];

export function LocalTracksSourceNode(
    props: Readonly<NodeProps<LocalTracksData>>,
): JSX.Element {
    const { control, errors, updateNodeField } = useNodeForm<LocalTracksData>(
        props.id,
        props.data,
        getDefaultValueForNodeType('localTracksSource'),
        LocalTracksDataSchema,
    );

    return (
        <Node isExecuting={props.data.isExecuting} isSelected={props.selected}>
            <SourceNodeHeader />
            <NodeContent>
                <NodeTitle title="Local tracks" />

                <NodeField
                    tooltip="Search filter to apply"
                    label="Filter"
                    error={errors.filter}
                >
                    <TextController
                        placeholder="Search"
                        control={control}
                        name="filter"
                        onChange={(value) => {
                            updateNodeField({ filter: value });
                        }}
                    />
                </NodeField>

                <NodeField label="Sort by" error={errors.sortField}>
                    <SelectController
                        label="Property to sort on"
                        name="sortField"
                        control={control}
                        items={propertyItems}
                        onChange={(value) => {
                            updateNodeField({
                                sortField: value,
                            });
                        }}
                    />
                </NodeField>
                <NodeField label="Order" error={errors.sortOrder}>
                    <SelectController
                        label="Sort order"
                        name="sortOrder"
                        control={control}
                        items={orderItems}
                        onChange={(value) => {
                            updateNodeField({
                                sortOrder: value,
                            });
                        }}
                    />
                </NodeField>
            </NodeContent>
            <Handle
                type="source"
                position={Position.Right}
                style={{ top: '40px' }}
            />
        </Node>
    );
}
