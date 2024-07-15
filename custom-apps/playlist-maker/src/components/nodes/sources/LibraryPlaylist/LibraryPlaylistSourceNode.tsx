import React, { useEffect, useState } from 'react';
import { Handle, type NodeProps, Position } from 'reactflow';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { NodeHeader } from '../../shared/NodeHeader';
import { Node } from '../../shared/Node';
import { NodeContent } from '../../shared/NodeContent';
import type { PlaylistData } from 'custom-apps/playlist-maker/src/models/nodes/sources/my-playlists-source-processor';
import { getPlatformApiOrThrow } from '@shared/utils/spicetify-utils';
import type { Folder, Playlist, RootlistAPI } from '@shared/platform/rootlist';
import type { UserAPI } from '@shared/platform/user';
import { Select } from '@shared/components/inputs/Select/Select';
import { TextInput } from '../../../inputs/TextInput';
import { NumberInput } from '../../../inputs/NumberInput';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import { Controller } from 'react-hook-form';
import { NodeField } from '../../shared/NodeField';
import {
    numberValueSetter,
    stringValueSetter,
} from 'custom-apps/playlist-maker/src/utils/form-utils';
import { wholeNumber } from 'custom-apps/playlist-maker/src/utils/validation-utils';

// TODO: custom select with search field
// TODO: order playlists by name

export function LibraryPlaylistSourceNode(
    props: NodeProps<PlaylistData>,
): JSX.Element {
    const { register, errors, setValue, getValues, control } =
        useNodeForm<PlaylistData>(props.id, {
            playlist: props.data.playlist,
            offset: props.data.offset,
            filter: props.data.filter,
            limit: props.data.limit,
        });

    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [onlyMine, setOnlyMine] = useState<boolean>(false);

    useEffect(() => {
        async function getPlaylists(): Promise<void> {
            const rootlistAPI =
                getPlatformApiOrThrow<RootlistAPI>('RootlistAPI');
            const userAPI = getPlatformApiOrThrow<UserAPI>('UserAPI');

            const rootlistFolder = await rootlistAPI.getContents();
            const user = await userAPI.getUser();

            const isPlaylist = (item: Folder | Playlist): item is Playlist =>
                item.type === 'playlist';

            let filteredPlaylists: Playlist[] = rootlistFolder.items
                .flatMap((i) => (i.type === 'playlist' ? i : i.items))
                .filter(isPlaylist);

            if (onlyMine) {
                filteredPlaylists = filteredPlaylists.filter(
                    (p) => p.owner.uri === user.uri,
                );
            }

            setPlaylists(filteredPlaylists);
        }

        void getPlaylists();
    }, [onlyMine]);

    useEffect(() => {
        const selectedUri = getValues('playlist.uri');

        if (selectedUri === undefined) {
            return;
        }

        if (!playlists.map((p) => p.uri).includes(selectedUri)) {
            setValue('playlist', undefined, { shouldValidate: true });
        }
    }, [playlists, setValue, getValues]);

    return (
        <Node isExecuting={props.data.isExecuting}>
            <NodeHeader
                label="Source"
                backgroundColor="cornflowerblue"
                textColor="black"
            />
            <NodeContent>
                <TextComponent paddingBottom="8px" weight="bold">
                    Playlist
                </TextComponent>

                <label>
                    <TextComponent elementType="small">
                        Only my playlists
                    </TextComponent>
                    <input
                        type="checkbox"
                        checked={onlyMine}
                        onChange={(e) => {
                            setOnlyMine(!onlyMine);
                        }}
                    />
                </label>

                <NodeField
                    label="Playlist"
                    error={
                        errors.playlist === undefined
                            ? undefined
                            : {
                                  type: 'validate',
                                  message: errors.playlist.message,
                              }
                    }
                >
                    <Controller
                        name="playlist"
                        control={control}
                        rules={{
                            validate: (v) =>
                                v === undefined
                                    ? 'This field is required'
                                    : true,
                        }}
                        render={({ field: { onChange, value } }) => (
                            <Select
                                selectLabel="Select a playlist"
                                selectedValue={
                                    value === undefined ? null : value.uri
                                }
                                items={playlists.map((p) => ({
                                    value: p.uri,
                                    label: p.name,
                                }))}
                                onItemClicked={(item) => {
                                    onChange({
                                        uri: item.value,
                                        name: item.label,
                                    });
                                }}
                            />
                        )}
                    />
                </NodeField>

                <NodeField
                    tooltip="Search filter to apply"
                    label="Filter"
                    error={errors.filter}
                >
                    <TextInput
                        placeholder="Search"
                        {...register('filter', {
                            setValueAs: stringValueSetter,
                        })}
                    />
                </NodeField>

                <NodeField
                    label="Offset"
                    tooltip="Number of elements to skip"
                    error={errors.offset}
                >
                    <NumberInput
                        placeholder="0"
                        {...register('offset', {
                            setValueAs: numberValueSetter,
                            min: {
                                value: 0,
                                message: 'The value must be greater than 0',
                            },
                            validate: {
                                whole: wholeNumber,
                            },
                        })}
                    />
                </NodeField>

                <NodeField
                    label="Limit"
                    tooltip="Number of elements to take. Leave empty to take all elements."
                    error={errors.limit}
                >
                    <NumberInput
                        placeholder="None"
                        {...register('limit', {
                            setValueAs: numberValueSetter,
                            min: {
                                value: 0,
                                message: 'The value must be greater than 0',
                            },
                            validate: {
                                whole: wholeNumber,
                            },
                        })}
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
