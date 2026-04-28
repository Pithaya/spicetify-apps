import { useComboboxValues } from 'custom-apps/playlist-maker/src/hooks/use-combobox-values';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import {
    usePlaylistComboboxFetchers,
    type PlaylistItem,
} from 'custom-apps/playlist-maker/src/hooks/use-playlist-combobox-fetchers';
import {
    RecommendedPlaylistTracksDataSchema,
    type RecommendedPlaylistTracksData,
} from 'custom-apps/playlist-maker/src/models/processors/sources/recommended-playlist-tracks-source-processor';
import { getDefaultValueForNodeType } from 'custom-apps/playlist-maker/src/utils/node-utils';
import { Music } from 'lucide-react';
import React, { useCallback, useEffect } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { type ItemRendererProps } from '../../inputs/ComboBox';
import { ComboBoxController } from '../../inputs/ComboBoxController';
import { NumberController } from '../../inputs/NumberController';
import { Node } from '../shared/Node';
import { NodeComboField } from '../shared/NodeComboField';
import { NodeContent } from '../shared/NodeContent';
import { NodeField } from '../shared/NodeField';
import { SourceNodeHeader } from '../shared/NodeHeader';
import { NodeTitle } from '../shared/NodeTitle';

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

export function RecommendedPlaylistTracksSourceNode(
    props: Readonly<NodeProps<RecommendedPlaylistTracksData>>,
): JSX.Element {
    const { playlistUri } = props.data;

    const { errors, control, updateNodeField } =
        useNodeForm<RecommendedPlaylistTracksData>(
            props.id,
            props.data,
            getDefaultValueForNodeType('recommendedPlaylistTracksSource'),
            RecommendedPlaylistTracksDataSchema,
        );

    const onPlaylistNotFound = useCallback(() => {
        updateNodeField({ playlistUri: '' });
    }, [updateNodeField]);

    const { getPlaylist, getPlaylists, itemToString } =
        usePlaylistComboboxFetchers(onPlaylistNotFound);

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
                <NodeTitle
                    title="Recommended tracks"
                    tooltip="Get recommended tracks for the selected playlist."
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
                    label="Limit"
                    tooltip="Number of tracks to get. Leave empty for default (20)."
                    error={errors.limit}
                >
                    <NumberController
                        placeholder="20"
                        control={control}
                        name="limit"
                        onChange={(value) => {
                            updateNodeField({ limit: value });
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
