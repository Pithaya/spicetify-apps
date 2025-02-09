import React from 'react';
import { Menu } from './Menu';

export type Props = {
    artists: { name: string; uri: string }[];
    onArtistClick: (uri: string) => void;
};

export function ArtistSelectionMenu(props: Readonly<Props>): JSX.Element {
    return (
        <Menu>
            {props.artists.map((a) => {
                return (
                    <Spicetify.ReactComponent.MenuItem
                        onClick={() => {
                            props.onArtistClick(a.uri);
                        }}
                        key={a.uri}
                    >
                        <span>{a.name}</span>
                    </Spicetify.ReactComponent.MenuItem>
                );
            })}
        </Menu>
    );
}
