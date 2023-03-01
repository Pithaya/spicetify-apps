import { LocalTrack } from '@shared';
import { Routes } from 'custom-apps/better-local-files/src/constants/constants';
import { navigateTo } from 'custom-apps/better-local-files/src/helpers/history-helper';
import React from 'react';

// TODO: Only relevant props
interface TrackListRowAlbumLinkProps {
    track: LocalTrack;
}

export function TrackListRowAlbumLink(props: TrackListRowAlbumLinkProps) {
    return (
        <Spicetify.ReactComponent.RightClickMenu
            menu={
                // TODO: Album menu
                <Spicetify.ReactComponent.Menu>
                    <Spicetify.ReactComponent.MenuItem>
                        <span>Album menu</span>
                    </Spicetify.ReactComponent.MenuItem>
                </Spicetify.ReactComponent.Menu>
            }
        >
            <a
                draggable="true"
                className="standalone-ellipsis-one-line"
                dir="auto"
                href="#"
                tabIndex={-1}
                onClick={() =>
                    navigateTo(Routes.album, {
                        uri: props.track.album.uri,
                    })
                }
            >
                {props.track.album.name}
            </a>
        </Spicetify.ReactComponent.RightClickMenu>
    );
}
