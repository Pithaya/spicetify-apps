import {
    Routes,
    SPOTIFY_MENU_CLASSES,
} from 'custom-apps/better-local-files/src/constants/constants';
import { navigateTo } from 'custom-apps/better-local-files/src/helpers/history-helper';
import React from 'react';

export interface ArtistSelectionMenuProps {
    artists: { name: string; uri: string }[];
}

export function ArtistSelectionMenu(props: ArtistSelectionMenuProps) {
    return (
        <Spicetify.ReactComponent.Menu className={SPOTIFY_MENU_CLASSES}>
            {props.artists.map((a) => {
                return (
                    <Spicetify.ReactComponent.MenuItem
                        onClick={() => navigateTo(Routes.artist, a.uri)}
                    >
                        <span>{a.name}</span>
                    </Spicetify.ReactComponent.MenuItem>
                );
            })}
        </Spicetify.ReactComponent.Menu>
    );
}
