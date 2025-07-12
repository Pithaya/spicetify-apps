import { getTrack as getApiTrack } from '@shared/api/endpoints/tracks/get-track';
import type { Item } from '@shared/components/inputs/Select/Select';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { searchDesktop } from '@shared/graphQL/queries/search-desktop';
import { useComboboxValues } from 'custom-apps/playlist-maker/src/hooks/use-combobox-values';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import {
    type RadioData,
    RadioDataSchema,
} from 'custom-apps/playlist-maker/src/models/nodes/sources/radio-source-processor';
import { getDefaultValueForNodeType } from 'custom-apps/playlist-maker/src/utils/node-utils';
import { Music } from 'lucide-react';
import React, { useCallback, useEffect } from 'react';
import { Handle, type NodeProps, Position } from 'reactflow';
import { type ItemRendererProps } from '../../inputs/ComboBox';
import { ComboBoxController } from '../../inputs/ComboBoxController';
import { NumberController } from '../../inputs/NumberController';
import { SelectController } from '../../inputs/SelectController';
import { Node } from '../shared/Node';
import { NodeComboField } from '../shared/NodeComboField';
import { NodeContent } from '../shared/NodeContent';
import { NodeField } from '../shared/NodeField';
import { SourceNodeHeader } from '../shared/NodeHeader';
import { NodeTitle } from '../shared/NodeTitle';

const propertyItems: Item<RadioData['sortField']>[] = [
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

const orderItems: Item<RadioData['sortOrder']>[] = [
    { value: 'ASC', label: 'Ascending' },
    { value: 'DESC', label: 'Descending' },
];

type TrackItem = {
    id: string;
    uri: string;
    name: string;
    image: string | null;
    album: string;
    artists: string;
};

function TrackItemRenderer(
    props: Readonly<ItemRendererProps<TrackItem>>,
): JSX.Element {
    return (
        <div className="flex max-h-[80px] items-stretch gap-2">
            <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center !p-2">
                {props.item.image && (
                    <img
                        src={props.item.image}
                        className="rounded-md object-contain"
                        alt="album"
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
                    {props.item.album} - {props.item.artists}
                </span>
            </div>
        </div>
    );
}

export function RadioTrackSourceNode(
    props: Readonly<NodeProps<RadioData>>,
): JSX.Element {
    const { uri } = props.data;
    const { errors, control, updateNodeField } = useNodeForm<RadioData>(
        props.id,
        props.data,
        getDefaultValueForNodeType('radioTrackSource'),
        RadioDataSchema,
    );

    const getTracks = useCallback(
        async (input: string): Promise<TrackItem[]> => {
            if (!input.trim()) {
                return [];
            }

            const search = await searchDesktop({
                searchTerm: input,
                offset: 0,
                limit: 10,
                includePreReleases: true,
                includeArtistHasConcertsField: false,
                includeAudiobooks: false,
                includeLocalConcertsField: false,
                numberOfTopResults: 5,
            });

            const items: TrackItem[] = search.searchV2.tracksV2.items.map(
                (track) => {
                    return {
                        id: track.item.data.uri,
                        uri: track.item.data.uri,
                        name: track.item.data.name,
                        image:
                            track.item.data.albumOfTrack.coverArt.sources
                                .length > 0
                                ? track.item.data.albumOfTrack.coverArt
                                      .sources[0].url
                                : null,
                        artists: track.item.data.artists.items
                            .map((artist) => artist.profile.name)
                            .join(', '),
                        album: track.item.data.albumOfTrack.name,
                    };
                },
            );

            return items;
        },
        [],
    );

    const getTrack = useCallback(
        async (trackUri: string): Promise<TrackItem | null> => {
            try {
                const track = await getApiTrack({
                    uri: trackUri,
                });

                const trackItem: TrackItem = {
                    id: track.uri,
                    name: track.name,
                    uri: track.uri,
                    image:
                        track.album.images.length > 0
                            ? track.album.images[0].url
                            : null,
                    artists: track.artists
                        .map((artist) => artist.name)
                        .join(', '),
                    album: track.album.name,
                };

                return trackItem;
            } catch (e) {
                console.error('Failed to fetch track', e);
                updateNodeField({ uri: '' });

                return null;
            }
        },
        [updateNodeField],
    );

    const itemToString = useCallback(
        (item: TrackItem): string => item.name,
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
    } = useComboboxValues<TrackItem>(
        getTrack,
        getTracks,
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
                    title="Track radio"
                    tooltip="Get a radio playlist based on a track."
                />

                <NodeComboField error={errors.uri}>
                    <ComboBoxController
                        control={control}
                        name="uri"
                        selectedItem={selectedItem}
                        onItemSelected={onItemSelected}
                        items={items}
                        itemRenderer={TrackItemRenderer}
                        itemToString={itemToString}
                        label="Track"
                        placeholder="Search for a track"
                        inputValue={inputValue}
                        onInputChanged={onInputChanged}
                        onClear={resetSelection}
                        onBlur={syncInputWithSelectedItem}
                    />
                </NodeComboField>
                <TextComponent
                    elementType="p"
                    fontSize="small"
                    semanticColor="textSubdued"
                >
                    Selected: {props.data.uri === '' ? '-' : props.data.uri}
                </TextComponent>

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
