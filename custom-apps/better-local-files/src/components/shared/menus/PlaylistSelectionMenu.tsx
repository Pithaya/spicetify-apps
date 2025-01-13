import React, { useEffect, useState } from 'react';
import type { PlaylistAPI } from '@shared/platform/playlist';
import type { Playlist } from '@shared/platform/rootlist';
import type { UserAPI } from '@shared/platform/user';
import { getPlatformApiOrThrow } from '@shared/utils/spicetify-utils';
import { SPOTIFY_MENU_CLASSES } from 'custom-apps/better-local-files/src/constants/constants';
import { getRootlistPlaylists } from '@shared/utils/rootlist-utils';

export type Props = {
    tracksUri: string[];
};

export function PlaylistSelectionMenu(props: Readonly<Props>): JSX.Element {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    useEffect(() => {
        async function getPlaylists(): Promise<void> {
            const userAPI = getPlatformApiOrThrow<UserAPI>('UserAPI');
            const user = await userAPI.getUser();

            const playlists = await getRootlistPlaylists();
            const userPlaylists: Playlist[] = playlists.filter(
                (p) => p.owner.uri === user.uri,
            );

            setPlaylists(userPlaylists);
        }

        void getPlaylists();
    }, []);

    async function addToPlaylist(playlistUri: string): Promise<void> {
        const playlistAPI = getPlatformApiOrThrow<PlaylistAPI>('PlaylistAPI');
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
