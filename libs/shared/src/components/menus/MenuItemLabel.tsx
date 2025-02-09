import React, { type PropsWithChildren } from 'react';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';

export function MenuItemLabel(props: Readonly<PropsWithChildren>): JSX.Element {
    return (
        <TextComponent
            className="main-contextMenu-menuItemLabel ellipsis-one-line"
            variant="mesto"
        >
            {props.children}
        </TextComponent>
    );
}
