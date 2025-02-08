import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import type { PlaylistAPI } from '@shared/platform/playlist';
import type { UserAPI } from '@shared/platform/user';
import { getRootlistPlaylists } from '@shared/utils/rootlist-utils';
import { getPlatformApiOrThrow } from '@shared/utils/spicetify-utils';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import {
    PlaylistDataSchema,
    type PlaylistData,
} from 'custom-apps/playlist-maker/src/models/nodes/sources/my-playlists-source-processor';
import { getDefaultValueForNodeType } from 'custom-apps/playlist-maker/src/utils/node-utils';
import { LoaderCircle, Music } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { CheckboxController } from '../../inputs/CheckboxController';
import { type ItemRendererProps } from '../../inputs/ComboBox';
import { ComboBoxController } from '../../inputs/ComboBoxController';
import { NumberController } from '../../inputs/NumberController';
import { SelectController } from '../../inputs/SelectController';
import { TextController } from '../../inputs/TextController';
import { Node } from '../shared/Node';
import { NodeComboField } from '../shared/NodeComboField';
import { NodeContent } from '../shared/NodeContent';
import { NodeField } from '../shared/NodeField';
import { SourceNodeHeader } from '../shared/NodeHeader';
import { NodeTitle } from '../shared/NodeTitle';

const propertyValues: Record<PlaylistData['sortField'], string> = {
    ALBUM: 'Album',
    ARTIST: 'Artist',
    TITLE: 'Name',
    DURATION: 'Duration',
    ADDED_AT: 'Added at',
    ADDED_BY: 'Added by',
    PUBLISH_DATE: 'Publish date',
    SHOW_NAME: 'Show name',
    NO_SORT: 'No sort',
};

const orderValues: Record<PlaylistData['sortOrder'], string> = {
    ASC: 'Ascending',
    DESC: 'Descending',
};

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

export function LibraryPlaylistSourceNode(
    props: Readonly<NodeProps<PlaylistData>>,
): JSX.Element {
    const { onlyMine: onlyMyPlaylists, offset } = props.data;

    const getPlaylists = useCallback(
        async (input: string): Promise<PlaylistItem[]> => {
            console.log(
                `NODE - getting playlists with input "${input}"`,
                onlyMyPlaylists,
            );
            const userAPI = getPlatformApiOrThrow<UserAPI>('UserAPI');
            const user = await userAPI.getUser();

            let playlists = await getRootlistPlaylists(input);

            playlists = playlists.filter((p) => p.name !== '');

            if (onlyMyPlaylists) {
                playlists = playlists.filter((p) => p.owner.uri === user.uri);
            }

            playlists = playlists.toSorted((a, b) =>
                a.name.localeCompare(b.name),
            );

            console.log('NODE - got playlists', playlists);

            return playlists.map((p) => ({
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
        },
        [onlyMyPlaylists],
    );

    const [selectedPlaylist, setSelectedPlaylist] =
        useState<PlaylistItem | null>(null);
    const [isPlaylistComboReady, setIsPlaylistComboReady] = useState(false);

    const { errors, control, setError, getValues, updateNodeField } =
        useNodeForm<PlaylistData>(
            props.id,
            props.data,
            getDefaultValueForNodeType('libraryPlaylistSource'),
            PlaylistDataSchema,
        );

    useEffect(() => {
        // On init, get the initial value for the selected playlist
        // if the playlistUri is not empty

        const { playlistUri } = props.data;

        if (playlistUri === '') {
            setIsPlaylistComboReady(true);
            return;
        }

        const getPlaylist = async (): Promise<void> => {
            const playlistApi =
                getPlatformApiOrThrow<PlaylistAPI>('PlaylistAPI');

            console.log(
                'NODE - node init with playlist',
                playlistUri,
                ' and ready',
                isPlaylistComboReady,
            );

            try {
                const playlist = await playlistApi.getPlaylist(
                    playlistUri,
                    {},
                    {},
                );
                setSelectedPlaylist({
                    id: playlist.metadata.uri,
                    name: playlist.metadata.name,
                    uri: playlist.metadata.uri,
                    image:
                        playlist.metadata.images.length > 0
                            ? playlist.metadata.images[0].url
                            : null,
                    ownerName: playlist.metadata.owner.displayName,
                });
                setIsPlaylistComboReady(true);
            } catch (e) {
                console.error('Failed to fetch playlist', e);
                setError('playlistUri', {
                    message: 'Invalid playlist URI',
                });
                updateNodeField({ playlistUri: '' });
            }

            setIsPlaylistComboReady(true);
        };

        void getPlaylist();
    }, []);

    useEffect(() => {
        console.log(
            'NODE - offset has changed in props.data useEffect',
            offset,
        );
    }, [offset]);

    return (
        <Node isExecuting={props.data.isExecuting}>
            <SourceNodeHeader />

            <p>Form Values:</p>
            <p>{JSON.stringify(getValues())}</p>
            <p>props.data : </p>
            <p>{JSON.stringify(props.data)}</p>
            <NodeContent>
                <NodeTitle title="Playlist" />

                <NodeField label="Only my playlists" error={errors.onlyMine}>
                    <div className="flex justify-end">
                        <CheckboxController
                            control={control}
                            name="onlyMine"
                            onChange={(value) => {
                                updateNodeField({ onlyMine: value });
                            }}
                        />
                    </div>
                </NodeField>

                <TextComponent
                    elementType="p"
                    fontSize="small"
                    semanticColor="textSubdued"
                >
                    Selected: {props.data.playlistUri}
                </TextComponent>
                <NodeComboField error={errors.playlistUri}>
                    {isPlaylistComboReady && (
                        <ComboBoxController
                            control={control}
                            name="playlistUri"
                            selectedItem={selectedPlaylist}
                            onSelectedItemChange={setSelectedPlaylist}
                            fetchItems={getPlaylists}
                            itemRenderer={PlaylistItemRenderer}
                            itemToString={(item: PlaylistItem) => item.name}
                            label="Playlist"
                            placeholder="Search for a playlist"
                            required
                        />
                    )}
                    {!isPlaylistComboReady && (
                        <div className="bg-spice-tab-active flex h-[34px] items-center justify-end rounded-sm !pe-1">
                            <LoaderCircle
                                size={24}
                                strokeWidth={1}
                                className="animate-spin"
                            />
                        </div>
                    )}
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
                        items={Object.entries(propertyValues).map(
                            ([key, label]) => ({
                                label,
                                value: key,
                            }),
                        )}
                        onChange={(value) => {
                            updateNodeField({ sortField: value as any });
                        }}
                    />
                </NodeField>
                <NodeField label="Order" error={errors.sortOrder}>
                    <SelectController
                        label="Sort order"
                        name="sortOrder"
                        control={control}
                        items={Object.entries(orderValues).map(
                            ([key, label]) => ({
                                label,
                                value: key,
                            }),
                        )}
                        onChange={(value) => {
                            updateNodeField({ sortOrder: value as any });
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
