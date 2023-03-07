import { Playlist, PlaylistAPI, RootlistAPI, UserAPI } from '@shared';
import React, { useEffect, useState } from 'react';

export interface PlaylistSelectionMenuProps {
    trackUri: string;
}

export function PlaylistSelectionMenu(props: PlaylistSelectionMenuProps) {
    const playlistAPI = Spicetify.Platform.PlaylistAPI as PlaylistAPI;
    const rootlistAPI = Spicetify.Platform.RootlistAPI as RootlistAPI;
    const userAPI = Spicetify.Platform.UserAPI as UserAPI;

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
        await playlistAPI.add(playlistUri, [props.trackUri], { after: 'end' });
    }

    return (
        <Spicetify.ReactComponent.Menu>
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
