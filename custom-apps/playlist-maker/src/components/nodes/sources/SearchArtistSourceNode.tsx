import { type Item } from '@shared/components/inputs/Select/Select';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { queryArtistOverview } from '@shared/graphQL/queries/query-artist-overview';
import { searchDesktop } from '@shared/graphQL/queries/search-desktop';
import { useComboboxValues } from 'custom-apps/playlist-maker/src/hooks/use-combobox-values';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import {
    type ArtistData,
    ArtistDataSchema,
    type ArtistTrackType,
} from 'custom-apps/playlist-maker/src/models/nodes/sources/artist-tracks-source-processor';
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

type ArtistItem = {
    id: string;
    uri: string;
    name: string;
    image: string | null;
};

function ArtistItemRenderer(
    props: Readonly<ItemRendererProps<ArtistItem>>,
): JSX.Element {
    return (
        <div className="flex max-h-[80px] items-stretch gap-2">
            <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center !p-2">
                {props.item.image && (
                    <img
                        src={props.item.image}
                        className="rounded-full object-contain"
                        alt="artist"
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

    const getArtists = useCallback(
        async (input: string): Promise<ArtistItem[]> => {
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

            const items: ArtistItem[] = search.searchV2.artists.items.map(
                (artist) => ({
                    id: artist.data.uri,
                    uri: artist.data.uri,
                    name: artist.data.profile.name,
                    image:
                        artist.data.visuals.avatarImage?.sources &&
                        artist.data.visuals.avatarImage.sources.length > 0
                            ? artist.data.visuals.avatarImage.sources[0].url
                            : null,
                }),
            );

            return items;
        },
        [],
    );

    const getArtist = useCallback(
        async (artistUri: string): Promise<ArtistItem | null> => {
            try {
                const artist = await queryArtistOverview({
                    uri: artistUri,
                    locale: Spicetify.Locale.getLocale(),
                });

                if (artist.artistUnion.__typename === 'NotFound') {
                    throw new Error('Artist not found');
                }

                const artistItem: ArtistItem = {
                    id: artist.artistUnion.uri,
                    name: artist.artistUnion.profile.name,
                    uri: artist.artistUnion.uri,
                    image:
                        artist.artistUnion.visuals.avatarImage.sources.length >
                        0
                            ? artist.artistUnion.visuals.avatarImage.sources[0]
                                  .url
                            : null,
                };

                return artistItem;
            } catch (e) {
                console.error('Failed to fetch artist', e);
                updateNodeField({ uri: '' });

                return null;
            }
        },
        [updateNodeField],
    );

    const itemToString = useCallback(
        (item: ArtistItem): string => item.name,
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
                        required
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
                                trackType: value!,
                            });
                        }}
                    />
                </NodeField>
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
