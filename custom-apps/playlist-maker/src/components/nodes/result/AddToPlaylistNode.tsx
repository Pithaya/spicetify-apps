import { type Item } from '@shared/components/inputs/Select/Select';
import { getRootlistPlaylists } from '@shared/utils/rootlist-utils';
import { getPlatform } from '@shared/utils/spicetify-utils';
import { useComboboxValues } from 'custom-apps/playlist-maker/src/hooks/use-combobox-values';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import {
    type AddToPlaylistData,
    AddToPlaylistDataSchema,
} from 'custom-apps/playlist-maker/src/models/processors/results/add-to-playlist-processor';
import { getDefaultValueForNodeType } from 'custom-apps/playlist-maker/src/utils/node-utils';
import { Music } from 'lucide-react';
import React, { useCallback, useEffect } from 'react';
import { Handle, type NodeProps, Position } from 'reactflow';
import { CheckboxController } from '../../inputs/CheckboxController';
import { type ItemRendererProps } from '../../inputs/ComboBox';
import { ComboBoxController } from '../../inputs/ComboBoxController';
import { SelectController } from '../../inputs/SelectController';
import { Node } from '../shared/Node';
import { NodeCheckboxField } from '../shared/NodeCheckboxField';
import { NodeComboField } from '../shared/NodeComboField';
import { NodeContent } from '../shared/NodeContent';
import { NodeField } from '../shared/NodeField';
import { ResultNodeHeader } from '../shared/NodeHeader';
import { NodeTitle } from '../shared/NodeTitle';

const operationItems: Item<AddToPlaylistData['operation']>[] = [
    { value: 'add', label: 'Add' },
    { value: 'replace', label: 'Replace' },
];

type PlaylistItem = {
    id: string;
    uri: string;
    name: string;
    image: string | null;
    ownerName: string;
};

function PlaylistItemRenderer(
    props: Readonly<ItemRendererProps<PlaylistItem>>,
): JSX.Element {
    return (
        <div className="flex max-h-[80px] items-stretch gap-2">
            <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center !p-2">
                {props.item.image && (
                    <img
                        src={props.item.image}
                        className="rounded-md object-contain"
                        alt="playlist"
                    />
                )}
                {props.item.image === null && (
                    <Music size={60} strokeWidth={1} />
                )}
            </div>

            <div className="flex min-w-0 flex-col items-stretch justify-center">
                <span
                    className={Spicetify.classnames(
                        'truncate',
                        props.isSelected ? 'font-bold' : '',
                    )}
                >
                    {props.item.name}
                </span>
                <span className="truncate text-sm">
                    by {props.item.ownerName}
                </span>
            </div>
        </div>
    );
}

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

    const getPlaylists = useCallback(
        async (input: string): Promise<PlaylistItem[]> => {
            const userAPI = getPlatform().UserAPI;
            const user = await userAPI.getUser();

            let playlists = await getRootlistPlaylists(input);

            playlists = playlists
                .filter((p) => p.name !== '' && p.owner.uri === user.uri)
                .toSorted((a, b) => a.name.localeCompare(b.name));

            const items = playlists.map((p) => ({
                id: p.uri,
                name: p.name,
                uri: p.uri,
                image:
                    p.images.length > 0
                        ? (p.images.find((i) => i.label === 'small')?.url ??
                          p.images[0].url)
                        : null,
                ownerName: p.owner.displayName,
            }));

            return items;
        },
        [],
    );

    const getPlaylist = useCallback(
        async (playlistUri: string): Promise<PlaylistItem | null> => {
            const playlistApi = getPlatform().PlaylistAPI;

            try {
                const playlist = await playlistApi.getPlaylist(
                    playlistUri,
                    {},
                    {},
                );

                const playlistItem: PlaylistItem = {
                    id: playlist.metadata.uri,
                    name: playlist.metadata.name,
                    uri: playlist.metadata.uri,
                    image:
                        playlist.metadata.images.length > 0
                            ? playlist.metadata.images[0].url
                            : null,
                    ownerName: playlist.metadata.owner.displayName,
                };

                return playlistItem;
            } catch (e) {
                console.error('Failed to fetch playlist', e);
                updateNodeField({ playlistUri: '' });

                return null;
            }
        },
        [updateNodeField],
    );

    const itemToString = useCallback(
        (item: PlaylistItem): string => item.name,
        [],
    );

    const {
        inputValue,
        items,
        onInputChanged,
        onItemSelected,
        resetSelection,
        selectedItem,
        syncInputWithSelectedItem,
        onSelectedIdChanged,
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
