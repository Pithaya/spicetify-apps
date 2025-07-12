import type { Item } from '@shared/components/inputs/Select/Select';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { getAlbum as getGraphQlAlbum } from '@shared/graphQL/queries/get-album';
import { searchDesktop } from '@shared/graphQL/queries/search-desktop';
import {
    type AlbumResponseWrapper,
    type PreReleaseResponseWrapper,
} from '@shared/graphQL/types/search-desktop-data-albums';
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

type AlbumItem = {
    id: string;
    uri: string;
    name: string;
    image: string | null;
    artists: string;
};

function AlbumItemRenderer(
    props: Readonly<ItemRendererProps<AlbumItem>>,
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
                <span className="truncate text-sm">{props.item.artists}</span>
            </div>
        </div>
    );
}

export function RadioAlbumSourceNode(
    props: Readonly<NodeProps<RadioData>>,
): JSX.Element {
    const { uri } = props.data;
    const { errors, control, updateNodeField } = useNodeForm<RadioData>(
        props.id,
        props.data,
        getDefaultValueForNodeType('radioAlbumSource'),
        RadioDataSchema,
    );

    const getAlbums = useCallback(
        async (input: string): Promise<AlbumItem[]> => {
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

            const items: AlbumItem[] = search.searchV2.albumsV2.items.map(
                (album) => {
                    const albumIsPrelease = (
                        album: PreReleaseResponseWrapper | AlbumResponseWrapper,
                    ): album is PreReleaseResponseWrapper => {
                        return album.__typename === 'PreReleaseResponseWrapper';
                    };

                    if (albumIsPrelease(album)) {
                        return {
                            id: album.data.uri,
                            uri: album.data.uri,
                            name: album.data.preReleaseContent.name,
                            image:
                                album.data.preReleaseContent.coverArt.sources
                                    .length > 0
                                    ? album.data.preReleaseContent.coverArt
                                          .sources[0].url
                                    : null,
                            artists: album.data.preReleaseContent.artists.items
                                .map((artist) => artist.data.profile.name)
                                .join(', '),
                        };
                    } else {
                        return {
                            id: album.data.uri,
                            uri: album.data.uri,
                            name: album.data.name,
                            image:
                                album.data.coverArt.sources.length > 0
                                    ? album.data.coverArt.sources[0].url
                                    : null,
                            artists: album.data.artists.items
                                .map((artist) => artist.profile.name)
                                .join(', '),
                        };
                    }
                },
            );

            return items;
        },
        [],
    );

    const getAlbum = useCallback(
        async (albumUri: string): Promise<AlbumItem | null> => {
            try {
                const album = await getGraphQlAlbum({
                    uri: albumUri,
                    offset: 0,
                    limit: 0,
                    locale: Spicetify.Locale.getLocale(),
                });

                if (album.albumUnion.__typename === 'NotFound') {
                    throw new Error('Album not found');
                }

                const albumItem: AlbumItem = {
                    id: album.albumUnion.uri,
                    name: album.albumUnion.name,
                    uri: album.albumUnion.uri,
                    image:
                        album.albumUnion.coverArt.sources.length > 0
                            ? album.albumUnion.coverArt.sources[0].url
                            : null,
                    artists: album.albumUnion.artists.items
                        .map((artist) => artist.profile.name)
                        .join(', '),
                };

                return albumItem;
            } catch (e) {
                console.error('Failed to fetch album', e);
                updateNodeField({ uri: '' });

                return null;
            }
        },
        [updateNodeField],
    );

    const itemToString = useCallback(
        (item: AlbumItem): string => item.name,
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
    } = useComboboxValues<AlbumItem>(
        getAlbum,
        getAlbums,
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
                    title="Album radio"
                    tooltip="Get a radio playlist based on an album."
                />

                <NodeComboField error={errors.uri}>
                    <ComboBoxController
                        control={control}
                        name="uri"
                        selectedItem={selectedItem}
                        onItemSelected={onItemSelected}
                        items={items}
                        itemRenderer={AlbumItemRenderer}
                        itemToString={itemToString}
                        label="Album"
                        placeholder="Search for an album"
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
