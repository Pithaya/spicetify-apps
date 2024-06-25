import React from 'react';
import { SubmenuItem } from './SubmenuItem';
import { getTranslation } from 'custom-apps/better-local-files/src/utils/translations.utils';
import { navigateTo } from 'custom-apps/better-local-files/src/utils/history.utils';
import {
    ALBUM_ROUTE,
    ARTIST_ROUTE,
    SPOTIFY_MENU_CLASSES,
} from 'custom-apps/better-local-files/src/constants/constants';
import { ArtistSelectionMenu } from './ArtistSelectionMenu';
import type { Track } from 'custom-apps/better-local-files/src/models/track';
import { PlaylistSelectionMenu } from './PlaylistSelectionMenu';
import { getPlatformApiOrThrow } from '@shared/utils/spicetify-utils';
import { SpotifyIcon } from '@shared/components/ui/SpotifyIcon/SpotifyIcon';
import { addToQueuePath } from '../icons/icons';
import { useIsInLibrary } from 'custom-apps/better-local-files/src/hooks/use-is-in-library';
import type { LibraryAPI } from '@shared/platform/library';
import type { PlayerAPI } from '@shared/platform/player';

export type Props = {
    track: Track;
};

export function RowMenu(props: Readonly<Props>): JSX.Element {
    const [trackInLibrary] = useIsInLibrary(props.track.uri);

    let trackMenuItem: JSX.Element;

    switch (trackInLibrary) {
        case true:
            trackMenuItem = (
                <Spicetify.ReactComponent.MenuItem
                    onClick={removeFromLikedSongs}
                    leadingIcon={
                        <SpotifyIcon
                            icon="check-alt-fill"
                            iconSize={16}
                            semanticColor="essentialBrightAccent"
                        />
                    }
                >
                    <span>
                        {getTranslation(['remove_from_your_liked_songs'])}
                    </span>
                </Spicetify.ReactComponent.MenuItem>
            );
            break;
        case false:
            trackMenuItem = (
                <Spicetify.ReactComponent.MenuItem
                    onClick={addToLikedSongs}
                    leadingIcon={<SpotifyIcon icon="plus-alt" iconSize={16} />}
                >
                    <span>{getTranslation(['save_to_your_liked_songs'])}</span>
                </Spicetify.ReactComponent.MenuItem>
            );
            break;
        default:
            trackMenuItem = (
                <Spicetify.ReactComponent.MenuItem>
                    <span>...</span>
                </Spicetify.ReactComponent.MenuItem>
            );
            break;
    }

    async function addToLikedSongs(): Promise<void> {
        await getPlatformApiOrThrow<LibraryAPI>('LibraryAPI').add({
            uris: [props.track.uri],
        });
    }

    async function removeFromLikedSongs(): Promise<void> {
        await getPlatformApiOrThrow<LibraryAPI>('LibraryAPI').remove({
            uris: [props.track.uri],
        });
    }

    async function addToQueue(): Promise<void> {
        await getPlatformApiOrThrow<PlayerAPI>('PlayerAPI').addToQueue([
            { uri: props.track.uri },
        ]);
    }

    return (
        <Spicetify.ReactComponent.Menu className={SPOTIFY_MENU_CLASSES}>
            <SubmenuItem
                label={getTranslation(['contextmenu.add-to-playlist'])}
                submenu={
                    <PlaylistSelectionMenu tracksUri={[props.track.uri]} />
                }
                leadingIcon={<SpotifyIcon icon="plus2px" iconSize={16} />}
            />

            {trackMenuItem}

            <Spicetify.ReactComponent.MenuItem
                divider="after"
                onClick={addToQueue}
                leadingIcon={
                    <SpotifyIcon iconPath={addToQueuePath} iconSize={16} />
                }
            >
                <span>{getTranslation(['contextmenu.add-to-queue'])}</span>
            </Spicetify.ReactComponent.MenuItem>

            {props.track.artists.length === 1 ? (
                <Spicetify.ReactComponent.MenuItem
                    onClick={() => {
                        navigateTo(ARTIST_ROUTE, props.track.artists[0].uri);
                    }}
                    leadingIcon={<SpotifyIcon icon="artist" iconSize={16} />}
                >
                    <span>{getTranslation(['contextmenu.go-to-artist'])}</span>
                </Spicetify.ReactComponent.MenuItem>
            ) : (
                <SubmenuItem
                    label={getTranslation(['contextmenu.go-to-artist'])}
                    submenu={
                        <ArtistSelectionMenu artists={props.track.artists} />
                    }
                    leadingIcon={<SpotifyIcon icon="artist" iconSize={16} />}
                />
            )}

            <Spicetify.ReactComponent.MenuItem
                onClick={() => {
                    navigateTo(ALBUM_ROUTE, props.track.album.uri);
                }}
                leadingIcon={<SpotifyIcon icon="album" iconSize={16} />}
            >
                <span>{getTranslation(['contextmenu.go-to-album'])}</span>
            </Spicetify.ReactComponent.MenuItem>
        </Spicetify.ReactComponent.Menu>
    );
}
