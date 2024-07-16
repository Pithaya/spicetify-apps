import React, { useCallback, useEffect } from 'react';
import styles from './CreatePlaylistModal.module.scss';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import useAppStore from 'custom-apps/playlist-maker/src/stores/store';
import { useForm } from 'react-hook-form';
import { useShallow } from 'zustand/react/shallow';
import { InputError } from '../../inputs/InputError';
import { TextInput } from '../../inputs/TextInput';
import { stringValueSetter } from 'custom-apps/playlist-maker/src/utils/form-utils';
import type { Folder, RootlistAPI } from '@shared/platform/rootlist';
import { getRootlistFolders } from '@shared/utils/rootlist-utils';
import { getPlatformApiOrThrow } from '@shared/utils/spicetify-utils';
import { type PlaylistAPI } from '@shared/platform/playlist';

type Form = {
    playlistName: string | undefined;
    parentFolder: string | undefined;
};

const defaultValues: Form = {
    playlistName: undefined,
    parentFolder: undefined,
};

export function CreatePlaylistModal(): JSX.Element {
    const [isCreating, setIsCreating] = React.useState(false);
    const [folders, setFolders] = React.useState<
        { uri: string; name: string }[]
    >([]);

    const { workflowName, result } = useAppStore(
        useShallow((state) => ({
            workflowName: state.workflowName,
            result: state.result,
        })),
    );

    const {
        register,
        formState: { errors, isValid },
        getValues,
    } = useForm<Form>({
        mode: 'onChange',
        defaultValues: {
            ...defaultValues,
            playlistName: workflowName,
        },
    });

    const createPlaylist = useCallback(async () => {
        setIsCreating(true);

        const rootlistAPI = getPlatformApiOrThrow<RootlistAPI>('RootlistAPI');
        const playlistAPI = getPlatformApiOrThrow<PlaylistAPI>('PlaylistAPI');

        const { playlistName, parentFolder } = getValues();

        try {
            const createdPlaylistUri = await rootlistAPI.createPlaylist(
                playlistName ?? 'New playlist',
                {
                    after:
                        parentFolder !== undefined && parentFolder !== ''
                            ? { uri: parentFolder }
                            : 'end',
                },
            );

            await playlistAPI.add(
                createdPlaylistUri,
                result.map((t) => t.uri),
                { after: 'end' },
            );
        } catch (e) {
            console.error('Error creating playlist', e);
            Spicetify.showNotification('Error creating playlist', false);
            setIsCreating(false);
            return;
        }

        setIsCreating(false);
        Spicetify.PopupModal.hide();
    }, [getValues, result]);

    useEffect(() => {
        async function getFolders(): Promise<void> {
            const folders: Folder[] = await getRootlistFolders();

            setFolders(folders.map((f) => ({ uri: f.uri, name: f.name })));
        }

        void getFolders();
    }, []);

    return (
        <div>
            <TextComponent paddingBottom="8px" weight="bold" elementType="p">
                Save {result.length} tracks to a new playlist
            </TextComponent>

            <fieldset className={styles['fieldset']} disabled={isCreating}>
                <label>
                    <TextComponent elementType="small" paddingBottom="4px">
                        Playlist name
                    </TextComponent>

                    <TextInput
                        placeholder={'Playlist name'}
                        {...register('playlistName', {
                            setValueAs: stringValueSetter,
                            required: true,
                        })}
                    />
                </label>
                <InputError error={errors.playlistName} />

                <label>
                    <TextComponent elementType="small" paddingBottom="4px">
                        Parent folder
                    </TextComponent>

                    <select
                        className="main-dropDown-dropDown"
                        style={{ width: '100%' }}
                        {...register('parentFolder', {
                            setValueAs: stringValueSetter,
                        })}
                    >
                        <option value="">Root</option>
                        {folders.map((f) => (
                            <option key={f.uri} value={f.uri}>
                                {f.name}
                            </option>
                        ))}
                    </select>
                </label>

                <div className={styles['button-wrapper']}>
                    <Spicetify.ReactComponent.ButtonPrimary
                        disabled={!isValid}
                        buttonSize="sm"
                        onClick={async () => {
                            await createPlaylist();
                        }}
                    >
                        Create playlist
                    </Spicetify.ReactComponent.ButtonPrimary>
                </div>
            </fieldset>
        </div>
    );
}
