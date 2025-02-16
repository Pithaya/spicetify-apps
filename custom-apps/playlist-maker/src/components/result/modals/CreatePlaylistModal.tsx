import { zodResolver } from '@hookform/resolvers/zod';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import type { Folder } from '@shared/platform/rootlist';
import { getRootlistFolders } from '@shared/utils/rootlist-utils';
import { getPlatform } from '@shared/utils/spicetify-utils';
import useAppStore from 'custom-apps/playlist-maker/src/stores/store';
import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useShallow } from 'zustand/react/shallow';
import { InputError } from '../../inputs/InputError';
import { SelectController } from '../../inputs/SelectController';
import { TextController } from '../../inputs/TextController';
import styles from './CreatePlaylistModal.module.scss';

const FormSchema = z.object({
    playlistName: z.string().nonempty({ message: 'Name cannot be empty' }),
    parentFolder: z.string().optional(),
});

type Form = z.infer<typeof FormSchema>;

const defaultValues: Form = {
    playlistName: 'My playlist',
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
        formState: { errors, isValid },
        getValues,
        control,
    } = useForm<Form>({
        mode: 'onChange',
        defaultValues: {
            ...defaultValues,
            playlistName: workflowName,
        },
        resolver: zodResolver(FormSchema),
    });

    const createPlaylist = useCallback(async () => {
        setIsCreating(true);

        const rootlistAPI = getPlatform().RootlistAPI;
        const playlistAPI = getPlatform().PlaylistAPI;

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

                    <TextController
                        placeholder={'Playlist name'}
                        control={control}
                        name="playlistName"
                    />
                </label>
                <InputError error={errors.playlistName} />

                <label>
                    <TextComponent elementType="small" paddingBottom="4px">
                        Parent folder
                    </TextComponent>

                    <SelectController
                        label="Root"
                        name="parentFolder"
                        control={control}
                        items={folders.map((f) => ({
                            label: f.name,
                            value: f.uri,
                        }))}
                    />
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
