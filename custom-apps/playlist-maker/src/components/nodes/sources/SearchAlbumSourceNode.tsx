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
    type AlbumData,
    AlbumDataSchema,
} from 'custom-apps/playlist-maker/src/models/nodes/sources/album-source-processor';
import { getDefaultValueForNodeType } from 'custom-apps/playlist-maker/src/utils/node-utils';
import { Music } from 'lucide-react';
import React, { useCallback, useEffect } from 'react';
import { Handle, type NodeProps, Position } from 'reactflow';
import { CheckboxController } from '../../inputs/CheckboxController';
import { type ItemRendererProps } from '../../inputs/ComboBox';
import { ComboBoxController } from '../../inputs/ComboBoxController';
import { NumberController } from '../../inputs/NumberController';
import { Node } from '../shared/Node';
import { NodeCheckboxField } from '../shared/NodeCheckboxField';
import { NodeComboField } from '../shared/NodeComboField';
import { NodeContent } from '../shared/NodeContent';
import { NodeField } from '../shared/NodeField';
import { SourceNodeHeader } from '../shared/NodeHeader';
import { NodeTitle } from '../shared/NodeTitle';

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

export function SearchAlbumSourceNode(
    props: Readonly<NodeProps<AlbumData>>,
): JSX.Element {
    const { uri } = props.data;
    const { errors, control, updateNodeField } = useNodeForm<AlbumData>(
        props.id,
        props.data,
        getDefaultValueForNodeType('searchAlbumSource'),
        AlbumDataSchema,
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
                    title="Album"
                    tooltip="Search for an album using Spotify's search. You can use advanced search tags sush as 'genre:' or 'year:'."
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

                <NodeCheckboxField
                    label="Only liked songs"
                    tooltip="Only keep songs that are liked in this album"
                    error={errors.onlyLiked}
                >
                    <CheckboxController
                        control={control}
                        name="onlyLiked"
                        onChange={(value) => {
                            updateNodeField({ onlyLiked: value });
                        }}
                    />
                </NodeCheckboxField>
            </NodeContent>
            <Handle
                type="source"
                position={Position.Right}
                id="result"
                style={{ top: '40px' }}
            />
        </Node>
    );
}
