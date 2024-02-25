import type { PlaylistAPI } from '@shared/platform/playlist';
import type { Folder, Playlist, RootlistAPI } from '@shared/platform/rootlist';
import type { UserAPI } from '@shared/platform/user';
import { getPlatformApiOrThrow } from '@shared/utils/spicetify-utils';
import { SPOTIFY_MENU_CLASSES } from 'custom-apps/better-local-files/src/constants/constants';
import React, { useEffect, useState } from 'react';

export type Props = {
    tracksUri: string[];
};

export function PlaylistSelectionMenu(props: Readonly<Props>): JSX.Element {
    const playlistAPI = getPlatformApiOrThrow<PlaylistAPI>('PlaylistAPI');
    const rootlistAPI = getPlatformApiOrThrow<RootlistAPI>('RootlistAPI');
    const userAPI = getPlatformApiOrThrow<UserAPI>('UserAPI');

    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    useEffect(() => {
        async function getPlaylists(): Promise<void> {
            const rootlistFolder = await rootlistAPI.getContents();
            const user = await userAPI.getUser();

            const isPlaylist = (item: Folder | Playlist): item is Playlist =>
                item.type === 'playlist';

            const userPlaylists: Playlist[] = rootlistFolder.items
                .flatMap((i) => (i.type === 'playlist' ? i : i.items))
                .filter(isPlaylist)
                .filter((p) => p.owner.uri === user.uri);

            setPlaylists(userPlaylists);
        }

        void getPlaylists();
    }, []);

    async function addToPlaylist(playlistUri: string): Promise<void> {
        await playlistAPI.add(playlistUri, props.tracksUri, { after: 'end' });
    }

    return (
        <Spicetify.ReactComponent.Menu className={SPOTIFY_MENU_CLASSES}>
            {playlists.map((p) => {
                return (
                    <Spicetify.ReactComponent.MenuItem
                        onClick={async () => {
                            await addToPlaylist(p.uri);
                        }}
                        key={p.uri}
                    >
                        <span>{p.name}</span>
                    </Spicetify.ReactComponent.MenuItem>
                );
            })}
        </Spicetify.ReactComponent.Menu>
    );
}
