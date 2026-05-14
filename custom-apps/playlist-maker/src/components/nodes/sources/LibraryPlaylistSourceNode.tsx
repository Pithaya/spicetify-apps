import type { Item } from '@shared/components/inputs/Select/Select';
import { useComboboxValues } from 'custom-apps/playlist-maker/src/hooks/use-combobox-values';
import { useLibraryPlaylistComboboxFetchers } from 'custom-apps/playlist-maker/src/hooks/use-library-playlist-combobox-fetchers';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import {
    PlaylistDataSchema,
    type PlaylistData,
} from 'custom-apps/playlist-maker/src/models/processors/sources/playlist-tracks-source-processor';
import { getDefaultValueForNodeType } from 'custom-apps/playlist-maker/src/utils/node-utils';
import React, { useCallback, useEffect } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { CheckboxController } from '../../inputs/CheckboxController';
import { ComboBoxController } from '../../inputs/ComboBoxController';
import { NumberController } from '../../inputs/NumberController';
import { SelectController } from '../../inputs/SelectController';
import { TextController } from '../../inputs/TextController';
import { PlaylistItemRenderer } from '../shared/ItemRenderers';
import { Node } from '../shared/Node';
import { NodeCheckboxField } from '../shared/NodeCheckboxField';
import { NodeComboField } from '../shared/NodeComboField';
import { NodeContent } from '../shared/NodeContent';
import { NodeField } from '../shared/NodeField';
import { SourceNodeHeader } from '../shared/NodeHeader';
import { NodeTitle } from '../shared/NodeTitle';

const propertyItems: Item<PlaylistData['sortField']>[] = [
    { value: 'ALBUM', label: 'Album' },
    { value: 'ARTIST', label: 'Artist' },
    { value: 'TITLE', label: 'Name' },
    { value: 'DURATION', label: 'Duration' },
    { value: 'ADDED_AT', label: 'Added at' },
    { value: 'ADDED_BY', label: 'Added by' },
    { value: 'PUBLISH_DATE', label: 'Publish date' },
    { value: 'SHOW_NAME', label: 'Show name' },
    { value: 'NO_SORT', label: 'No sort' },
];

const orderItems: Item<PlaylistData['sortOrder']>[] = [
    { value: 'ASC', label: 'Ascending' },
    { value: 'DESC', label: 'Descending' },
];

type PlaylistItem = {
    id: string;
    uri: string;
    name: string;
    image: string | null;
    ownerName: string;
};

export function LibraryPlaylistSourceNode(
    props: Readonly<NodeProps<PlaylistData>>,
): JSX.Element {
    const { onlyMine: onlyMyPlaylists, playlistUri } = props.data;

    const { errors, control, updateNodeField } = useNodeForm<PlaylistData>(
        props.id,
        props.data,
        getDefaultValueForNodeType('libraryPlaylistSource'),
        PlaylistDataSchema,
    );

    const onPlaylistNotFound = useCallback(() => {
        updateNodeField({ playlistUri: '' });
    }, [updateNodeField]);

    const { getPlaylist, getPlaylists, itemToString } =
        useLibraryPlaylistComboboxFetchers(onlyMyPlaylists, onPlaylistNotFound);

    const {
        inputValue,
        items,
        onInputChanged,
        onItemSelected,
        resetSelection,
        selectedItem,
        syncInputWithSelectedItem,
        onSelectedIdChanged,
        fetchLoading,
    } = useComboboxValues<PlaylistItem>(
        getPlaylist,
        getPlaylists,
        itemToString,
        (item) => {
            updateNodeField({ playlistUri: item?.uri ?? '' });
        },
    );

    useEffect(() => {
        void onSelectedIdChanged(playlistUri);
    }, [playlistUri, onSelectedIdChanged]);

    return (
        <Node isExecuting={props.data.isExecuting} isSelected={props.selected}>
            <SourceNodeHeader />

            <NodeContent>
                <NodeTitle title="Saved playlist" />

                <NodeCheckboxField
                    label="Search only my playlists"
                    error={errors.onlyMine}
                >
                    <CheckboxController
                        control={control}
                        name="onlyMine"
                        onChange={(value) => {
                            updateNodeField({ onlyMine: value });
                        }}
                    />
                </NodeCheckboxField>

                <NodeComboField error={errors.playlistUri}>
                    <ComboBoxController
                        control={control}
                        name="playlistUri"
                        selectedItem={selectedItem}
                        onItemSelected={onItemSelected}
                        items={items}
                        itemRenderer={PlaylistItemRenderer}
                        itemToString={itemToString}
                        label="Playlist"
                        placeholder="Search for a playlist"
                        inputValue={inputValue}
                        onInputChanged={onInputChanged}
                        onClear={resetSelection}
                        onBlur={syncInputWithSelectedItem}
                        loading={fetchLoading}
                    />
                </NodeComboField>

                <NodeField
                    tooltip="Search filter to apply"
                    label="Filter"
                    error={errors.filter}
                >
                    <TextController
                        placeholder="Search"
                        name="filter"
                        control={control}
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
