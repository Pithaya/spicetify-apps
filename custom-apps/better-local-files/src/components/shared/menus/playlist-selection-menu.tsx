import { Folder, Playlist } from '@shared/platform/rootlist';
import { getPlatform } from '@shared/utils';
import { SPOTIFY_MENU_CLASSES } from 'custom-apps/better-local-files/src/constants/constants';
import React, { useEffect, useState } from 'react';

export interface PlaylistSelectionMenuProps {
    tracksUri: string[];
}

export function PlaylistSelectionMenu(props: PlaylistSelectionMenuProps) {
    const playlistAPI = getPlatform().PlaylistAPI;
    const rootlistAPI = getPlatform().RootlistAPI;
    const userAPI = getPlatform().UserAPI;

    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    useEffect(() => {
        async function getPlaylists() {
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
