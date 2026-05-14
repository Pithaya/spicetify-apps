import React, { type PropsWithChildren } from 'react';

export function Menu(props: Readonly<PropsWithChildren>): JSX.Element {
    // 25rem = 400px = 10 items (40px height)
    return (
        <Spicetify.ReactComponent.Menu
            style={{ backgroundColor: '(--spice-card)', maxHeight: '25rem' }}
        >
            {props.children}
        </Spicetify.ReactComponent.Menu>
    );
}
