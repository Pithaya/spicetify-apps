import { Platform, Playlist } from '@shared/platform';
import { SPOTIFY_MENU_CLASSES } from 'custom-apps/better-local-files/src/constants/constants';
import React, { useEffect, useState } from 'react';

export interface PlaylistSelectionMenuProps {
    tracksUri: string[];
}

export function PlaylistSelectionMenu(props: PlaylistSelectionMenuProps) {
    const playlistAPI = Platform.PlaylistAPI;
    const rootlistAPI = Platform.RootlistAPI;
    const userAPI = Platform.UserAPI;

    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    useEffect(() => {
        async function getPlaylists() {
            const rootlistFolder = await rootlistAPI.getContents();
            const user = await userAPI.getUser();

            const userPlaylists = rootlistFolder.items
                .flatMap((i) => (i.type === 'playlist' ? i : i.items))
                .filter(
                    (p) => p.type === 'playlist' && p.owner.uri === user.uri
                );

            setPlaylists(userPlaylists as Playlist[]);
        }

        getPlaylists();
    }, []);

    async function addToPlaylist(playlistUri: string) {
        await playlistAPI.add(playlistUri, props.tracksUri, { after: 'end' });
    }

    return (
        <Spicetify.ReactComponent.Menu className={SPOTIFY_MENU_CLASSES}>
            {playlists.map((p) => {
                return (
                    <Spicetify.ReactComponent.MenuItem
                        onClick={() => addToPlaylist(p.uri)}
                    >
                        <span>{p.name}</span>
                    </Spicetify.ReactComponent.MenuItem>
                );
            })}
        </Spicetify.ReactComponent.Menu>
    );
}
