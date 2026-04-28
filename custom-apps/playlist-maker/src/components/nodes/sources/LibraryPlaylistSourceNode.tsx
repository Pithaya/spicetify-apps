import type { Item } from '@shared/components/inputs/Select/Select';
import { getRootlistPlaylists } from '@shared/utils/rootlist-utils';
import { getPlatform } from '@shared/utils/spicetify-utils';
import { useComboboxValues } from 'custom-apps/playlist-maker/src/hooks/use-combobox-values';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import {
    PlaylistDataSchema,
    type PlaylistData,
} from 'custom-apps/playlist-maker/src/models/processors/sources/playlist-tracks-source-processor';
import { getDefaultValueForNodeType } from 'custom-apps/playlist-maker/src/utils/node-utils';
import { Music } from 'lucide-react';
import React, { useCallback, useEffect } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { CheckboxController } from '../../inputs/CheckboxController';
import { type ItemRendererProps } from '../../inputs/ComboBox';
import { ComboBoxController } from '../../inputs/ComboBoxController';
import { NumberController } from '../../inputs/NumberController';
import { SelectController } from '../../inputs/SelectController';
import { TextController } from '../../inputs/TextController';
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

function PlaylistItemRenderer(
    props: Readonly<ItemRendererProps<PlaylistItem>>,
): JSX.Element {
    return (
        <div className="tw:flex tw:max-h-[80px] tw:items-stretch tw:gap-2">
            <div className="tw:flex tw:h-[60px] tw:w-[60px] tw:shrink-0 tw:items-center tw:justify-center tw:p-2">
                {props.item.image ? (
                    <img
                        src={props.item.image}
                        className="tw:rounded-md tw:object-contain"
                        alt="playlist"
                    />
                ) : (
                    <Music size={60} strokeWidth={1} />
                )}
            </div>

            <div className="tw:flex tw:min-w-0 tw:flex-col tw:items-stretch tw:justify-center">
                <span
                    className={Spicetify.classnames(
                        'tw:truncate',
                        props.isSelected ? 'tw:font-bold' : '',
                    )}
                >
                    {props.item.name}
                </span>
                <span className="tw:truncate tw:text-sm">
                    by {props.item.ownerName}
                </span>
            </div>
        </div>
    );
}

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

    const getPlaylists = useCallback(
        async (input: string): Promise<PlaylistItem[]> => {
            const userAPI = getPlatform().UserAPI;
            const user = await userAPI.getUser();

            let playlists = await getRootlistPlaylists(input);

            playlists = playlists.filter((p) => p.name !== '');

            if (onlyMyPlaylists) {
                playlists = playlists.filter((p) => p.owner.uri === user.uri);
            }

            playlists = playlists.toSorted((a, b) =>
                a.name.localeCompare(b.name),
            );

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
        [onlyMyPlaylists],
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
