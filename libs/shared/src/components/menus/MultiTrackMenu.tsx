import { SpotifyIcon } from '@shared/components/ui/SpotifyIcon/SpotifyIcon';
import { addToQueuePath } from '@shared/icons/icons';
import type { PlayerAPI } from '@shared/platform/player';
import { getPlatformApiOrThrow } from '@shared/utils/spicetify-utils';
import { getTranslation } from '@shared/utils/translations.utils';
import React from 'react';
import { type ITrack } from '../track-list/models/interfaces';
import { Menu } from './Menu';
import { PlaylistSelectionMenu } from './PlaylistSelectionMenu';
import { SubmenuItem } from './SubmenuItem';

export type Props = {
    tracks: ITrack[];
};

export function MultiTrackMenu(props: Readonly<Props>): JSX.Element {
    async function addToQueue(): Promise<void> {
        await getPlatformApiOrThrow<PlayerAPI>('PlayerAPI').addToQueue(
            props.tracks.map((t) => ({ uri: t.uri })),
        );
    }

    return (
        <Menu>
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
        </Menu>
    );
}
