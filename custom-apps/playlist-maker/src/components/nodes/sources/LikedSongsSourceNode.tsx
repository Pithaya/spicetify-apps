import type { Item } from '@shared/components/inputs/Select/Select';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import {
    LikedSongsDataSchema,
    type LikedSongsData,
} from 'custom-apps/playlist-maker/src/models/nodes/sources/liked-songs-source-processor';
import { getDefaultValueForNodeType } from 'custom-apps/playlist-maker/src/utils/node-utils';
import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { NumberController } from '../../inputs/NumberController';
import { SelectController } from '../../inputs/SelectController';
import { TextController } from '../../inputs/TextController';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { NodeField } from '../shared/NodeField';
import { SourceNodeHeader } from '../shared/NodeHeader';
import { NodeTitle } from '../shared/NodeTitle';

const sortFieldItems: Item<LikedSongsData['sortField']>[] = [
    {
        label: 'Added at',
        value: 'ADDED_AT',
    },
    {
        label: 'Album',
        value: 'ALBUM_NAME',
    },
    {
        label: 'Artist',
        value: 'ARTIST_NAME',
    },
    {
        label: 'Name',
        value: 'NAME',
    },
];

const sortOrderItems: Item<LikedSongsData['sortOrder']>[] = [
    {
        label: 'Ascending',
        value: 'ASC',
    },
    {
        label: 'Descending',
        value: 'DESC',
    },
];

export function LikedSongsSourceNode(
    props: Readonly<NodeProps<LikedSongsData>>,
): JSX.Element {
    const { control, errors, updateNodeField } = useNodeForm<LikedSongsData>(
        props.id,
        props.data,
        getDefaultValueForNodeType('likedSongsSource'),
        LikedSongsDataSchema,
    );

    return (
        <Node isExecuting={props.data.isExecuting} isSelected={props.selected}>
            <SourceNodeHeader />
            <NodeContent>
                <NodeTitle title="Liked songs" />

                <NodeField
                    label="Filter"
                    tooltip="Search filter to apply"
                    error={errors.filter}
                >
                    <TextController
                        control={control}
                        placeholder="Search"
                        name="filter"
                        onChange={(value) => {
                            updateNodeField({ filter: value });
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

                <NodeField label="Sort by" error={errors.sortField}>
                    <SelectController
                        name="sortField"
                        control={control}
                        items={sortFieldItems}
                        label="Property to sort on"
                        onChange={(value) => {
                            updateNodeField({ sortField: value });
                        }}
                    />
                </NodeField>
                <NodeField label="Order" error={errors.sortOrder}>
                    <SelectController
                        name="sortOrder"
                        control={control}
                        items={sortOrderItems}
                        label="Sort order"
                        onChange={(value) => {
                            updateNodeField({ sortOrder: value });
                        }}
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
