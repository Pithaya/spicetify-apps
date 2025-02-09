import React, { type PropsWithChildren } from 'react';

export function Menu(props: Readonly<PropsWithChildren>): JSX.Element {
    return (
        <Spicetify.ReactComponent.Menu className="encore-dark-theme main-contextMenu-menu">
            {props.children}
        </Spicetify.ReactComponent.Menu>
    );
}
