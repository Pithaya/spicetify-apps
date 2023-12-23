import React, { useEffect, useState } from 'react';
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
import { SpotifyIcon } from '../icons/spotify-icon';
import { addToQueuePath } from '../icons/icons';

export type Props = {
    track: Track;
};

// TODO: multi track selection (hide go to artist / album in that case) (save to liked if at least one is not saved)
// TODO: Update options

export function RowMenu(props: Readonly<Props>): JSX.Element {
    const [trackInLibrary, setTrackInLibrary] = useState<boolean | undefined>(
        getPlatform().LibraryAPI.containsSync(props.track.uri),
    );

    useEffect(() => {
        if (trackInLibrary === undefined) {
            getPlatform()
                .LibraryAPI.contains(props.track.uri)
                .then((result) => {
                    setTrackInLibrary(result[0]);
                })
                .catch(console.error);
        }
    }, [props.track.uri]);

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
        await getPlatform().LibraryAPI.add({ uris: [props.track.uri] });
    }

    async function removeFromLikedSongs(): Promise<void> {
        await getPlatform().LibraryAPI.remove({ uris: [props.track.uri] });
    }

    async function addToQueue(): Promise<void> {
        await getPlatform().PlayerAPI.addToQueue([{ uri: props.track.uri }]);
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
