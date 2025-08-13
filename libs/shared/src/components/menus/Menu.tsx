import React, { type PropsWithChildren } from 'react';

export function Menu(props: Readonly<PropsWithChildren>): JSX.Element {
    return (
        <Spicetify.ReactComponent.Menu
            style={{ backgroundColor: '(--spice-card)' }}
        >
            {props.children}
        </Spicetify.ReactComponent.Menu>
    );
}
