import type { ITrack } from '@shared/components/track-list/models/interfaces';
import { SpotifyIcon } from '@shared/components/ui/SpotifyIcon/SpotifyIcon';
import { useIsInLibrary } from '@shared/hooks/use-is-in-library';
import { addToQueuePath } from '@shared/icons/icons';
import type { LibraryAPI } from '@shared/platform/library';
import type { PlayerAPI } from '@shared/platform/player';
import { getPlatformApiOrThrow } from '@shared/utils/spicetify-utils';
import { getTranslation } from '@shared/utils/translations.utils';
import React from 'react';
import { ArtistSelectionMenu } from '../menus/ArtistSelectionMenu';
import { Menu } from '../menus/Menu';
import { PlaylistSelectionMenu } from '../menus/PlaylistSelectionMenu';
import { SubmenuItem } from '../menus/SubmenuItem';

export type Props = {
    track: ITrack;
    onArtistClick: (uri: string) => void;
    onAlbumClick: (uri: string) => void;
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
        <Menu>
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
                        props.onArtistClick(props.track.artists[0].uri);
                    }}
                    leadingIcon={<SpotifyIcon icon="artist" iconSize={16} />}
                >
                    <span>{getTranslation(['contextmenu.go-to-artist'])}</span>
                </Spicetify.ReactComponent.MenuItem>
            ) : (
                <SubmenuItem
                    label={getTranslation(['contextmenu.go-to-artist'])}
                    submenu={
                        <ArtistSelectionMenu
                            artists={props.track.artists}
                            onArtistClick={props.onArtistClick}
                        />
                    }
                    leadingIcon={<SpotifyIcon icon="artist" iconSize={16} />}
                />
            )}

            <Spicetify.ReactComponent.MenuItem
                onClick={() => {
                    props.onAlbumClick(props.track.album.uri);
                }}
                leadingIcon={<SpotifyIcon icon="album" iconSize={16} />}
            >
                <span>{getTranslation(['contextmenu.go-to-album'])}</span>
            </Spicetify.ReactComponent.MenuItem>
        </Menu>
    );
}
