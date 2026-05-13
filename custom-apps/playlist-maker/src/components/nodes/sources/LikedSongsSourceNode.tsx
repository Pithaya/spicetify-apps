import type { Item } from '@shared/components/inputs/Select/Select';
import { getPlatform } from '@shared/utils/spicetify-utils';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import {
    LikedSongsDataSchema,
    type LikedSongsData,
} from 'custom-apps/playlist-maker/src/models/processors/sources/liked-songs-source-processor';
import { getDefaultValueForNodeType } from 'custom-apps/playlist-maker/src/utils/node-utils';
import React, { useEffect, useState } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { NumberController } from '../../inputs/NumberController';
import { SelectController } from '../../inputs/SelectController';
import { TagsInputController } from '../../inputs/TagsInputController';
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

const genresMatchModeItems: Item<LikedSongsData['genresMatchMode']>[] = [
    {
        label: 'All',
        value: 'AND',
    },
    {
        label: 'Any',
        value: 'OR',
    },
];

export function LikedSongsSourceNode(
    props: Readonly<NodeProps<LikedSongsData>>,
): JSX.Element {
    const { genres } = props.data;
    const { control, errors, updateNodeField } = useNodeForm<LikedSongsData>(
        props.id,
        props.data,
        getDefaultValueForNodeType('likedSongsSource'),
        LikedSongsDataSchema,
    );

    const [libraryGenres, setLibraryGenres] = useState<string[]>([]);

    useEffect(() => {
        const fetchGenres = async (): Promise<void> => {
            const tags = await getPlatform().LibraryAPI.getTracksFilterTags();

            const tagFilterPrefix = 'tags contains ';

            setLibraryGenres(
                tags
                    .map((tag) => tag.filter.slice(tagFilterPrefix.length))
                    .sort((a, b) => a.localeCompare(b)),
            );
        };

        void fetchGenres();
    }, []);

    return (
        <Node
            isExecuting={props.data.isExecuting}
            isSelected={props.selected}
            classname="tw:max-w-80"
        >
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

                <TagsInputController
                    control={control}
                    name="genres"
                    label="Genres"
                    placeholder="Type a genre and press Enter"
                    tooltip="Type a genre and press Enter, or pick one from your library suggestions. For some examples of genres that may be recognized by Spotify, check out https://www.everynoise.com/everynoise1d.html."
                    values={genres}
                    onValuesChange={(newValues) => {
                        updateNodeField({ genres: newValues });
                    }}
                    suggestions={libraryGenres}
                />

                <NodeField
                    label="Genres match mode"
                    tooltip="All: keep only tracks tagged with every selected genre. Any: keep tracks tagged with at least one of the selected genres."
                    error={errors.genresMatchMode}
                >
                    <SelectController
                        name="genresMatchMode"
                        control={control}
                        items={genresMatchModeItems}
                        label="Genres match mode"
                        onChange={(value) => {
                            updateNodeField({ genresMatchMode: value });
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
