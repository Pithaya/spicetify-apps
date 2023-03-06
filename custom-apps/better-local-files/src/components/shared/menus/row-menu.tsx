import React, { useRef } from 'react';
import { History, LocalTrack, PlayerAPI } from '@shared';
import { SubmenuItem } from './submenu-item';
import { getTranslation } from 'custom-apps/better-local-files/src/helpers/translations-helper';
import { navigateTo } from 'custom-apps/better-local-files/src/helpers/history-helper';
import { Routes } from 'custom-apps/better-local-files/src/constants/constants';
import { ArtistSelectionMenu } from './artist-selection-menu';

export interface IProps {
    track: LocalTrack;
}

// TODO: Add to playlist
// TODO: multi track selection

export function RowMenu(props: IProps) {
    function addToQueue() {
        (Spicetify.Platform.PlayerAPI as PlayerAPI).addToQueue([
            { uri: props.track.uri },
        ]);
    }

    return (
        <Spicetify.ReactComponent.Menu>
            <Spicetify.ReactComponent.MenuItem
                divider="after"
                onClick={addToQueue}
            >
                <span>{getTranslation(['contextmenu.add-to-queue'])}</span>
            </Spicetify.ReactComponent.MenuItem>

            {props.track.artists.length === 1 ? (
                <Spicetify.ReactComponent.MenuItem
                    onClick={() =>
                        navigateTo(Routes.artist, props.track.artists[0].uri)
                    }
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
                onClick={() => navigateTo(Routes.album, props.track.album.uri)}
            >
                <span>{getTranslation(['contextmenu.go-to-album'])}</span>
            </Spicetify.ReactComponent.MenuItem>
        </Spicetify.ReactComponent.Menu>
    );
}
