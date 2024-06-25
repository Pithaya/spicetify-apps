import React from 'react';
import { SubmenuItem } from './SubmenuItem';
import { getTranslation } from 'custom-apps/better-local-files/src/utils/translations.utils';
import type { Track } from 'custom-apps/better-local-files/src/models/track';
import { PlaylistSelectionMenu } from './PlaylistSelectionMenu';
import { SPOTIFY_MENU_CLASSES } from 'custom-apps/better-local-files/src/constants/constants';
import { getPlatformApiOrThrow } from '@shared/utils/spicetify-utils';
import { SpotifyIcon } from '@shared/components/ui/SpotifyIcon/SpotifyIcon';
import { addToQueuePath } from '../icons/icons';
import type { PlayerAPI } from '@shared/platform/player';

export type Props = {
    tracks: Track[];
};

export function MultiTrackMenu(props: Readonly<Props>): JSX.Element {
    async function addToQueue(): Promise<void> {
        await getPlatformApiOrThrow<PlayerAPI>('PlayerAPI').addToQueue(
            props.tracks.map((t) => ({ uri: t.uri })),
        );
    }

    return (
        <Spicetify.ReactComponent.Menu className={SPOTIFY_MENU_CLASSES}>
            <SubmenuItem
                label={getTranslation(['contextmenu.add-to-playlist'])}
                submenu={
                    <PlaylistSelectionMenu
                        tracksUri={props.tracks.map((t) => t.uri)}
                    />
                }
                leadingIcon={<SpotifyIcon icon="plus2px" iconSize={16} />}
            />

            <Spicetify.ReactComponent.MenuItem
                onClick={addToQueue}
                leadingIcon={
                    <SpotifyIcon iconPath={addToQueuePath} iconSize={16} />
                }
            >
                <span>{getTranslation(['contextmenu.add-to-queue'])}</span>
            </Spicetify.ReactComponent.MenuItem>
        </Spicetify.ReactComponent.Menu>
    );
}
