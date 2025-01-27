import { useMap } from '@shared/hooks/use-map';
import type { UserAPI } from '@shared/platform/user';
import { getEntries } from '@shared/utils/map-utils';
import { getRootlistPlaylists } from '@shared/utils/rootlist-utils';
import { getPlatformApiOrThrow } from '@shared/utils/spicetify-utils';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import {
    PlaylistDataSchema,
    type PlaylistData,
} from 'custom-apps/playlist-maker/src/models/nodes/sources/my-playlists-source-processor';
import {
    setValueAsNumber,
    setValueAsString,
} from 'custom-apps/playlist-maker/src/utils/form-utils';
import React, { useEffect } from 'react';
import { useWatch } from 'react-hook-form';
import { Handle, Position, type NodeProps } from 'reactflow';
import { NumberInput } from '../../inputs/NumberInput';
import { SelectController } from '../../inputs/SelectController';
import { TextInput } from '../../inputs/TextInput';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { NodeField } from '../shared/NodeField';
import { SourceNodeHeader } from '../shared/NodeHeader';
import { NodeTitle } from '../shared/NodeTitle';

// TODO: custom select with search field
// TODO: order playlists by name

const defaultValues: PlaylistData = {
    playlistUri: '',
    playlistName: '',
    offset: undefined,
    filter: undefined,
    limit: undefined,
    sortField: 'NO_SORT',
    sortOrder: 'ASC',
    isExecuting: undefined,
    onlyMine: false,
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
        useNodeForm<PlaylistData>(
            props.id,
            props.data,
            defaultValues,
            PlaylistDataSchema,
        );

    const [playlists, setPlaylists] = useMap<string, string>([
        [props.data.playlistUri, props.data.playlistName],
    ]);

    const playlistUri = useWatch({ control, name: 'playlistUri' });

    useEffect(() => {
        async function getPlaylists(): Promise<void> {
            const userAPI = getPlatformApiOrThrow<UserAPI>('UserAPI');
            const user = await userAPI.getUser();

            let playlists = await getRootlistPlaylists();

            if (props.data.onlyMine) {
                playlists = playlists.filter((p) => p.owner.uri === user.uri);
            }

            setPlaylists(playlists.map((p) => [p.uri, p.name]));
        }

        void getPlaylists();
    }, [props.data.onlyMine, setPlaylists]);

    useEffect(() => {
        // When the list of playlists changes, check if the selected playlist is still valid
        const selectedPlaylistUri = getValues('playlistUri');

        if (!selectedPlaylistUri) {
            return;
        }

        if (!playlists.has(selectedPlaylistUri)) {
            setValue('playlistUri', '', { shouldValidate: true });
        }
    }, [playlists, setValue, getValues]);

    useEffect(() => {
        // On selected playlist change, update the playlist name
        if (!playlistUri) {
            return;
        }

        if (playlists.has(playlistUri)) {
            setValue('playlistName', playlists.get(playlistUri)!, {
                shouldValidate: false,
            });
        } else {
            setValue('playlistName', '', { shouldValidate: false });
        }
    }, [playlistUri, playlists, setValue]);

    return (
        <Node isExecuting={props.data.isExecuting}>
            <SourceNodeHeader />
            <NodeContent>
                <NodeTitle title="Playlist" />

                <NodeField label="Only my playlists" error={errors.onlyMine}>
                    <input type="checkbox" {...register('onlyMine')} />
                </NodeField>

                <NodeField label="Playlist" error={errors.playlistUri}>
                    <SelectController
                        label="Select a playlist"
                        name="playlistUri"
                        control={control}
                        items={getEntries(playlists).map((p) => ({
                            value: p.key,
                            label: p.value,
                        }))}
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
                            setValueAs: setValueAsString,
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
                            setValueAs: setValueAsNumber,
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
                            setValueAs: setValueAsNumber,
                        })}
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
