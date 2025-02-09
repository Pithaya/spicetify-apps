import React, { type PropsWithChildren } from 'react';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';

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
