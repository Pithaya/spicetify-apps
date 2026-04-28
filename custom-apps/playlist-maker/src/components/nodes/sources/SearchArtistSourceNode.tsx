import { type Item } from '@shared/components/inputs/Select/Select';
import {
    type ArtistItem,
    useArtistComboboxFetchers,
} from 'custom-apps/playlist-maker/src/hooks/use-artist-combobox-fetchers';
import { useComboboxValues } from 'custom-apps/playlist-maker/src/hooks/use-combobox-values';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import {
    type ArtistData,
    ArtistDataSchema,
    type ArtistTrackType,
} from 'custom-apps/playlist-maker/src/models/processors/sources/artist-tracks-source-processor';
import { getDefaultValueForNodeType } from 'custom-apps/playlist-maker/src/utils/node-utils';
import { Music } from 'lucide-react';
import React, { useCallback, useEffect } from 'react';
import { Handle, type NodeProps, Position } from 'reactflow';
import { type ItemRendererProps } from '../../inputs/ComboBox';
import { ComboBoxController } from '../../inputs/ComboBoxController';
import { SelectController } from '../../inputs/SelectController';
import { Node } from '../shared/Node';
import { NodeComboField } from '../shared/NodeComboField';
import { NodeContent } from '../shared/NodeContent';
import { NodeField } from '../shared/NodeField';
import { SourceNodeHeader } from '../shared/NodeHeader';
import { NodeTitle } from '../shared/NodeTitle';

const trackTypeItems: Item<ArtistTrackType>[] = [
    {
        label: 'Liked tracks',
        value: 'liked',
    },
    {
        label: 'Top tracks & popular releases',
        value: 'top',
    },
    {
        label: 'Latest release',
        value: 'latest',
    },
    {
        label: 'All tracks',
        value: 'discography',
    },
];

function ArtistItemRenderer(
    props: Readonly<ItemRendererProps<ArtistItem>>,
): JSX.Element {
    return (
        <div className="flex max-h-[80px] items-stretch gap-2">
            <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center !p-2">
                {props.item.image ? (
                    <img
                        src={props.item.image}
                        className="rounded-full object-contain"
                        alt="artist"
                    />
                ) : (
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
            </div>
        </div>
    );
}

export function SearchArtistSourceNode(
    props: Readonly<NodeProps<ArtistData>>,
): JSX.Element {
    const { uri } = props.data;
    const { errors, control, updateNodeField } = useNodeForm<ArtistData>(
        props.id,
        props.data,
        getDefaultValueForNodeType('searchArtistSource'),
        ArtistDataSchema,
    );

    const onArtistNotFound = useCallback(() => {
        updateNodeField({ uri: '' });
    }, [updateNodeField]);

    const { getArtist, getArtists, itemToString } =
        useArtistComboboxFetchers(onArtistNotFound);

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
    } = useComboboxValues<ArtistItem>(
        getArtist,
        getArtists,
        itemToString,
        (item) => {
            updateNodeField({ uri: item?.uri ?? '' });
        },
    );

    useEffect(() => {
        void onSelectedIdChanged(uri);
    }, [uri, onSelectedIdChanged]);

    return (
        <Node isExecuting={props.data.isExecuting} isSelected={props.selected}>
            <SourceNodeHeader />
            <NodeContent>
                <NodeTitle
                    title="Artist"
                    tooltip="Search for an artist using Spotify's search. You can use advanced search tags sush as 'genre:' or 'year:'."
                />

                <NodeComboField error={errors.uri}>
                    <ComboBoxController
                        control={control}
                        name="uri"
                        selectedItem={selectedItem}
                        onItemSelected={onItemSelected}
                        items={items}
                        itemRenderer={ArtistItemRenderer}
                        itemToString={itemToString}
                        label="Artist"
                        placeholder="Search for an artist"
                        inputValue={inputValue}
                        onInputChanged={onInputChanged}
                        onClear={resetSelection}
                        onBlur={syncInputWithSelectedItem}
                        loading={fetchLoading}
                    />
                </NodeComboField>

                <NodeField
                    label="Type of tracks"
                    error={errors.trackType}
                    tooltip="Type of tracks to get from the artist : top tracks & popular releases, liked tracks, latest release or all tracks."
                >
                    <SelectController
                        label="Type of tracks"
                        name="trackType"
                        control={control}
                        items={trackTypeItems}
                        onChange={(value) => {
                            updateNodeField({
                                trackType: value,
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
