import React from 'react';
import { SubmenuItem } from './submenu-item';
import { getTranslation } from 'custom-apps/better-local-files/src/helpers/translations-helper';
import { navigateTo } from 'custom-apps/better-local-files/src/helpers/history-helper';
import {
    ALBUM_ROUTE,
    ARTIST_ROUTE,
    SPOTIFY_MENU_CLASSES,
} from 'custom-apps/better-local-files/src/constants/constants';
import { ArtistSelectionMenu } from './artist-selection-menu';
import type { Track } from 'custom-apps/better-local-files/src/models/track';
import { PlaylistSelectionMenu } from './playlist-selection-menu';
import { getPlatform } from '@shared/utils';

export type Props = {
    track: Track;
};

// TODO: multi track selection

export function RowMenu(props: Readonly<Props>): JSX.Element {
    async function addToQueue(): Promise<void> {
        await getPlatform().PlayerAPI.addToQueue([{ uri: props.track.uri }]);
    }

    return (
        <Spicetify.ReactComponent.Menu className={SPOTIFY_MENU_CLASSES}>
            <Spicetify.ReactComponent.MenuItem
                divider="after"
                onClick={addToQueue}
            >
                <span>{getTranslation(['contextmenu.add-to-queue'])}</span>
            </Spicetify.ReactComponent.MenuItem>

            {props.track.artists.length === 1 ? (
                <Spicetify.ReactComponent.MenuItem
                    onClick={() => {
                        navigateTo(ARTIST_ROUTE, props.track.artists[0].uri);
                    }}
                >
                    <span>{getTranslation(['contextmenu.go-to-artist'])}</span>
                </Spicetify.ReactComponent.MenuItem>
            ) : (
                <SubmenuItem
                    label={getTranslation(['contextmenu.go-to-artist'])}
                    submenu={
                        <ArtistSelectionMenu artists={props.track.artists} />
                    }
                />
            )}

            <Spicetify.ReactComponent.MenuItem
                divider="after"
                onClick={() => {
                    navigateTo(ALBUM_ROUTE, props.track.album.uri);
                }}
            >
                <span>{getTranslation(['contextmenu.go-to-album'])}</span>
            </Spicetify.ReactComponent.MenuItem>

            <SubmenuItem
                label={getTranslation(['contextmenu.add-to-playlist'])}
                submenu={
                    <PlaylistSelectionMenu tracksUri={[props.track.uri]} />
                }
            />
        </Spicetify.ReactComponent.Menu>
    );
}
