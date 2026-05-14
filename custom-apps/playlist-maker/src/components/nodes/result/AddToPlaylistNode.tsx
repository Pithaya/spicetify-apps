import { type Item } from '@shared/components/inputs/Select/Select';
import { useComboboxValues } from 'custom-apps/playlist-maker/src/hooks/use-combobox-values';
import {
    type PlaylistItem,
    useLibraryPlaylistComboboxFetchers,
} from 'custom-apps/playlist-maker/src/hooks/use-library-playlist-combobox-fetchers';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import {
    type AddToPlaylistData,
    AddToPlaylistDataSchema,
} from 'custom-apps/playlist-maker/src/models/processors/results/add-to-playlist-processor';
import { getDefaultValueForNodeType } from 'custom-apps/playlist-maker/src/utils/node-utils';
import React, { useCallback, useEffect } from 'react';
import { Handle, type NodeProps, Position } from 'reactflow';
import { CheckboxController } from '../../inputs/CheckboxController';
import { ComboBoxController } from '../../inputs/ComboBoxController';
import { SelectController } from '../../inputs/SelectController';
import { Node } from '../shared/Node';
import { NodeCheckboxField } from '../shared/NodeCheckboxField';
import { NodeComboField } from '../shared/NodeComboField';
import { NodeContent } from '../shared/NodeContent';
import { NodeField } from '../shared/NodeField';
import { ResultNodeHeader } from '../shared/NodeHeader';
import { NodeTitle } from '../shared/NodeTitle';
import { PlaylistItemRenderer } from '../shared/ItemRenderers';

const operationItems: Item<AddToPlaylistData['operation']>[] = [
    { value: 'add', label: 'Add' },
    { value: 'replace', label: 'Replace' },
];

export function AddToPlaylistNode(
    props: Readonly<NodeProps<AddToPlaylistData>>,
): JSX.Element {
    const { playlistUri, operation } = props.data;

    const { errors, control, updateNodeField } = useNodeForm<AddToPlaylistData>(
        props.id,
        props.data,
        getDefaultValueForNodeType('addToPlaylist'),
        AddToPlaylistDataSchema,
    );

    const onPlaylistNotFound = useCallback(() => {
        updateNodeField({ playlistUri: '' });
    }, [updateNodeField]);

    const { getPlaylist, getPlaylists, itemToString } =
        useLibraryPlaylistComboboxFetchers(true, onPlaylistNotFound);

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

    useEffect(() => {
        if (operation === 'replace') {
            updateNodeField({ addDuplicateTracks: false });
        }
    }, [operation, updateNodeField]);

    return (
        <Node isExecuting={props.data.isExecuting} isSelected={props.selected}>
            <ResultNodeHeader />

            <NodeContent>
                <NodeTitle
                    title="Add to playlist"
                    tooltip="Add the tracks to an existing playlist. They will also be visible in the result tab."
                />

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
                    label="Operation"
                    error={errors.operation}
                    tooltip='"Add" will add the tracks to the playlist, while "Replace" will remove all existing tracks and add the new ones.'
                >
                    <SelectController
                        label="Operation"
                        name="operation"
                        control={control}
                        items={operationItems}
                        onChange={(value) => {
                            updateNodeField({
                                operation: value,
                            });
                        }}
                    />
                </NodeField>

                {operation === 'add' && (
                    <NodeCheckboxField
                        label="Add tracks already in playlist"
                        error={errors.addDuplicateTracks}
                        tooltip="If checked, tracks that are already in the playlist will still be added, resulting in duplicates. If unchecked, only new tracks not already in the playlist be added."
                    >
                        <CheckboxController
                            control={control}
                            name="addDuplicateTracks"
                            onChange={(value) => {
                                updateNodeField({ addDuplicateTracks: value });
                            }}
                        />
                    </NodeCheckboxField>
                )}
            </NodeContent>
            <Handle
                type="target"
                position={Position.Left}
                style={{ top: '42px' }}
            />
        </Node>
    );
}
