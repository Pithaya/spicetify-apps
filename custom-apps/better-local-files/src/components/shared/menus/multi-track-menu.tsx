import React from 'react';
import { PlayerAPI } from '@shared/platform';
import { SubmenuItem } from './submenu-item';
import { getTranslation } from 'custom-apps/better-local-files/src/helpers/translations-helper';
import { Track } from 'custom-apps/better-local-files/src/models/track';
import { PlaylistSelectionMenu } from './playlist-selection-menu';
import { SPOTIFY_MENU_CLASSES } from 'custom-apps/better-local-files/src/constants/constants';

export interface MultiTrackMenuProps {
    tracks: Track[];
}

export function MultiTrackMenu(props: MultiTrackMenuProps) {
    function addToQueue() {
        (Spicetify.Platform.PlayerAPI as PlayerAPI).addToQueue(
            props.tracks.map((t) => ({ uri: t.uri }))
        );
    }

    return (
        <Spicetify.ReactComponent.Menu className={SPOTIFY_MENU_CLASSES}>
            <Spicetify.ReactComponent.MenuItem
                divider="after"
                onClick={addToQueue}
            >
                <span>{getTranslation(['contextmenu.add-to-queue'])}</span>
            </Spicetify.ReactComponent.MenuItem>

            <SubmenuItem
                label={getTranslation(['contextmenu.add-to-playlist'])}
                submenu={
                    <PlaylistSelectionMenu
                        tracksUri={props.tracks.map((t) => t.uri)}
                    />
                }
            />
        </Spicetify.ReactComponent.Menu>
    );
}
