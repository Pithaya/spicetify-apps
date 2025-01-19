import React, { useEffect, useState } from 'react';
import { Handle, type NodeProps, Position } from 'reactflow';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { SourceNodeHeader } from '../../shared/NodeHeader';
import { Node } from '../../shared/Node';
import { NodeContent } from '../../shared/NodeContent';
import type { PlaylistData } from 'custom-apps/playlist-maker/src/models/nodes/sources/my-playlists-source-processor';
import { getPlatformApiOrThrow } from '@shared/utils/spicetify-utils';
import type { Playlist } from '@shared/platform/rootlist';
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
import { type LocalNodeData } from 'custom-apps/playlist-maker/src/models/nodes/node-processor';
import { getRootlistPlaylists } from '@shared/utils/rootlist-utils';
import { NodeTitle } from '../../shared/NodeTitle';

// TODO: custom select with search field
// TODO: order playlists by name
// FIXME: leaving and coming back to the page trigger the playlist selection validation with undefined, and shows the error message

const defaultValues: LocalNodeData<PlaylistData> = {
    playlist: undefined,
    offset: undefined,
    filter: undefined,
    limit: undefined,
    sortField: 'NO_SORT',
    sortOrder: 'ASC',
};

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

export function LibraryPlaylistSourceNode(
    props: Readonly<NodeProps<PlaylistData>>,
): JSX.Element {
    const { register, errors, setValue, getValues, control } =
        useNodeForm<PlaylistData>(props.id, props.data, defaultValues);

    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [onlyMine, setOnlyMine] = useState<boolean>(false);

    useEffect(() => {
        async function getPlaylists(): Promise<void> {
            const userAPI = getPlatformApiOrThrow<UserAPI>('UserAPI');
            const user = await userAPI.getUser();

            let playlists = await getRootlistPlaylists();

            if (onlyMine) {
                playlists = playlists.filter((p) => p.owner.uri === user.uri);
            }

            setPlaylists(playlists);
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
            <SourceNodeHeader />
            <NodeContent>
                <NodeTitle title="Playlist" />

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

                <NodeField
                    label="Sort by"
                    error={
                        errors.sortField === undefined
                            ? undefined
                            : {
                                  type: 'validate',
                                  message: errors.sortField.message,
                              }
                    }
                >
                    <Controller
                        name="sortField"
                        control={control}
                        rules={{
                            validate: (v) =>
                                v === undefined
                                    ? 'This field is required'
                                    : true,
                        }}
                        render={({ field: { onChange, value } }) => (
                            <Select
                                selectLabel="Property to sort on"
                                selectedValue={value ?? null}
                                items={Object.entries(propertyValues).map(
                                    ([key, label]) => ({
                                        label,
                                        value: key,
                                    }),
                                )}
                                onItemClicked={(item) => {
                                    onChange(item.value);
                                }}
                            />
                        )}
                    />
                </NodeField>
                <NodeField
                    label="Order"
                    error={
                        errors.sortOrder === undefined
                            ? undefined
                            : {
                                  type: 'validate',
                                  message: errors.sortOrder.message,
                              }
                    }
                >
                    <Controller
                        name="sortOrder"
                        control={control}
                        rules={{
                            validate: (v) =>
                                v === undefined
                                    ? 'This field is required'
                                    : true,
                        }}
                        render={({ field: { onChange, value } }) => (
                            <Select
                                selectLabel="Sort order"
                                selectedValue={value ?? null}
                                items={Object.entries(orderValues).map(
                                    ([key, label]) => ({
                                        label,
                                        value: key,
                                    }),
                                )}
                                onItemClicked={(item) => {
                                    onChange(item.value);
                                }}
                                disabled={props.data.sortField === 'NO_SORT'}
                            />
                        )}
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
