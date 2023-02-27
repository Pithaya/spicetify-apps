import React, { useRef } from 'react';
import { History, LocalTrack } from '@shared';
import { SubMenu } from './sub-menu';

const appUrl = '/better-local-files';

export interface IProps {
    track: LocalTrack;
}

export function RowMenu(props: IProps) {
    const menuRef = useRef(null);

    function addToQueue() {
        Spicetify.addToQueue(props.track.uri);
    }

    function goToArtist() {
        (Spicetify.Platform.History as History).push(
            `${appUrl}/artists/${props.track.artists[0].uri}`
        );
    }

    function goToAlbum() {
        (Spicetify.Platform.History as History).push(
            `${appUrl}/albums/${props.track.album.uri}`
        );
    }

    const submenu = new Spicetify.ContextMenu.SubMenu('test', [
        new Spicetify.ContextMenu.Item('test', () => {}),
    ]);

    return (
        <Spicetify.ReactComponent.Menu ref={menuRef}>
            <Spicetify.ReactComponent.MenuItem
                divider="after"
                onClick={addToQueue}
            >
                <span>Ajouter à la file d'attente</span>
            </Spicetify.ReactComponent.MenuItem>
            <Spicetify.ReactComponent.MenuItem onClick={goToArtist}>
                <span>Accéder à l'artiste</span>
            </Spicetify.ReactComponent.MenuItem>
            <Spicetify.ReactComponent.MenuItem onClick={goToAlbum}>
                <span>Accéder à l'album</span>
            </Spicetify.ReactComponent.MenuItem>
            <SubMenu parentElement={menuRef.current}></SubMenu>
        </Spicetify.ReactComponent.Menu>
    );
}
