import type { Item } from '@shared/components/inputs/Select/Select';
import { SpotifyIcon } from '@shared/components/ui/SpotifyIcon/SpotifyIcon';
import { useMultiSelectValues } from 'custom-apps/playlist-maker/src/hooks/use-multiselect-values';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import {
    LikedSongsDataSchema,
    type LikedSongsData,
} from 'custom-apps/playlist-maker/src/models/processors/sources/liked-songs-source-processor';
import { Noop } from 'custom-apps/playlist-maker/src/utils/function-utils';
import { getDefaultValueForNodeType } from 'custom-apps/playlist-maker/src/utils/node-utils';
import { setLibraryGenresToCache } from 'custom-apps/playlist-maker/src/utils/track-utils';
import React, { useCallback, useEffect, useState } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { type ItemRendererProps } from '../../inputs/MultiSelect';
import { MultiSelectController } from '../../inputs/MultiSelectController';
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

type GenreItem = {
    id: string;
    name: string;
};

function GenreItemRenderer(
    props: Readonly<ItemRendererProps<GenreItem>>,
): JSX.Element {
    return (
        <div className="flex items-center justify-between gap-2 !px-2 !py-1">
            <span className="truncate">{props.item.name}</span>
            {props.isSelected && (
                <span className="shrink-0">
                    <SpotifyIcon
                        semanticColor="textBrightAccent"
                        icon="check"
                        iconSize={12}
                    />
                </span>
            )}
            {!props.isSelected && <div className="h-[12px] w-[12px]" />}
        </div>
    );
}

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

    const [libraryGenres, setLibraryGenres] = useState<GenreItem[]>([]);
    const [libraryGenresLoading, setLibraryGenresLoading] =
        useState<boolean>(true);

    const getSelectedGenres = useCallback(
        (ids: string[]): Promise<GenreItem[]> => {
            return Promise.resolve(
                libraryGenres.filter((genre) => ids.includes(genre.id)),
            );
        },
        [libraryGenres],
    );

    const getGenres = useCallback(
        (input: string): Promise<GenreItem[]> => {
            return Promise.resolve(
                libraryGenres.filter((genre) =>
                    genre.name.toLowerCase().includes(input.toLowerCase()),
                ),
            );
        },
        [libraryGenres],
    );

    const {
        items,
        selectedItems,
        onSelectedIdsChanged,
        inputValue,
        onInputChanged,
        onItemsSelected,
    } = useMultiSelectValues<GenreItem>(
        getSelectedGenres,
        getGenres,
        (items) => {
            updateNodeField({ genres: items.map((item) => item.id) });
        },
    );

    useEffect(() => {
        if (libraryGenresLoading) {
            return;
        }

        void onSelectedIdsChanged(genres);
    }, [genres, onSelectedIdsChanged, libraryGenresLoading]);

    useEffect(() => {
        const fetchGenres = async (): Promise<void> => {
            const genreCache = await setLibraryGenresToCache();
            const uniqueGenres = new Set<string>();

            genreCache.forEach((genres) => {
                for (const genre of genres) {
                    uniqueGenres.add(genre);
                }
            });

            setLibraryGenres(
                Array.from(uniqueGenres)
                    .sort((a, b) => a.localeCompare(b))
                    .map((genre) => ({
                        id: genre,
                        name: genre,
                    })),
            );
            setLibraryGenresLoading(false);
        };

        void fetchGenres();
    }, []);

    return (
        <Node
            isExecuting={props.data.isExecuting}
            isSelected={props.selected}
            classname="max-w-80"
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

                <MultiSelectController
                    control={control}
                    name="genres"
                    selectedItems={selectedItems}
                    onItemsSelected={onItemsSelected}
                    inputValue={inputValue}
                    onInputChanged={onInputChanged}
                    placeholder="Rock, Pop, Hip Hop..."
                    itemRenderer={GenreItemRenderer}
                    itemToString={(item) => item.name}
                    items={items}
                    label={
                        libraryGenresLoading ? 'Genres (loading...)' : 'Genres'
                    }
                    onBlur={Noop}
                    selectAllItem={{ id: 'select-all', name: 'Select all' }}
                    unselectAllItem={{
                        id: 'unselect-all',
                        name: 'Unselect all',
                    }}
                    disabled={libraryGenresLoading}
                />
            </NodeContent>
            <Handle
                type="source"
                position={Position.Right}
                style={{ top: '40px' }}
            />
        </Node>
    );
}
