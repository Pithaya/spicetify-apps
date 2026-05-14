import { SpotifyIcon } from '@shared/components/ui/SpotifyIcon/SpotifyIcon';
import { addToQueuePath } from '@shared/icons/icons';
import { getPlatform } from '@shared/utils/spicetify-utils';
import { getTranslation } from '@shared/utils/translations.utils';
import React from 'react';
import { Menu } from './Menu';
import { PlaylistSelectionMenu } from './PlaylistSelectionMenu';
import { SubmenuItem } from './SubmenuItem';

export type Props = {
    tracksUri: string[];
};

export function MultiTrackMenu(props: Readonly<Props>): JSX.Element {
    async function addToQueue(): Promise<void> {
        await getPlatform().PlayerAPI.addToQueue(
            props.tracksUri.map((uri) => ({ uri })),
        );
    }

    return (
        <Menu>
            <SubmenuItem
                label={getTranslation(['contextmenu.add-to-playlist'])}
                submenu={<PlaylistSelectionMenu tracksUri={props.tracksUri} />}
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
