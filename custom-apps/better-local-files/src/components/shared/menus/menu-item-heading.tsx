import React, { type PropsWithChildren } from 'react';
import { TextComponent } from '../text/text';

export function MenuItemHeading(
    props: Readonly<PropsWithChildren>,
): JSX.Element {
    return (
        <li>
            <TextComponent
                className="main-contextMenu-menuHeading ellipsis-one-line"
                variant="finaleBold"
            >
                {props.children}
            </TextComponent>
        </li>
    );
}
