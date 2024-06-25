import React from 'react';
import type { PropsWithChildren } from 'react';

export type Props = Spicetify.ReactComponent.TextComponentProps & {
    /**
     * DOM element type to render. Defaults to `span`.
     */
    elementType?:
        | 'span'
        | 'p'
        | 'h1'
        | 'h2'
        | 'h3'
        | 'h4'
        | 'h5'
        | 'h6'
        | 'small'
        | 'li';
    fontSize?:
        | 'xx-small'
        | 'x-small'
        | 'small'
        | 'medium'
        | 'large'
        | 'x-large'
        | 'xx-large'
        | 'xxx-large';

    className?: string;
    style?: React.CSSProperties;
};

export function TextComponent(
    props: Readonly<PropsWithChildren<Props>>,
): JSX.Element {
    const { elementType = 'span', children, ...rest } = props;

    let SpicetifyTextComponent;

    switch (elementType) {
        case 'h1':
            SpicetifyTextComponent = Spicetify.ReactComponent.TextComponent.h1;
            break;
        case 'h2':
            SpicetifyTextComponent = Spicetify.ReactComponent.TextComponent.h2;
            break;
        case 'h3':
            SpicetifyTextComponent = Spicetify.ReactComponent.TextComponent.h3;
            break;
        case 'h4':
            SpicetifyTextComponent = Spicetify.ReactComponent.TextComponent.h4;
            break;
        case 'h5':
            SpicetifyTextComponent = Spicetify.ReactComponent.TextComponent.h5;
            break;
        case 'h6':
            SpicetifyTextComponent = Spicetify.ReactComponent.TextComponent.h6;
            break;
        case 'li':
            SpicetifyTextComponent = Spicetify.ReactComponent.TextComponent.li;
            break;
        case 'p':
            SpicetifyTextComponent = Spicetify.ReactComponent.TextComponent.p;
            break;
        case 'small':
            SpicetifyTextComponent =
                Spicetify.ReactComponent.TextComponent.small;
            break;
        case 'span':
            SpicetifyTextComponent =
                Spicetify.ReactComponent.TextComponent.span;
            break;
        default:
            SpicetifyTextComponent = Spicetify.ReactComponent.TextComponent;
            break;
    }

    return (
        <SpicetifyTextComponent {...rest} style={props.style}>
            {children}
        </SpicetifyTextComponent>
    );
}
