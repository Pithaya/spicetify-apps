import React, { type PropsWithChildren } from 'react';

export type Props = {
    secondary?: boolean;
    selected?: boolean;

    /**
     * Default: invertedDark.
     */
    selectedColorSet?: Spicetify.ColorSet;

    className?: string;
    iconLeading?: (props: unknown) => string;
    iconTrailing?: (props: unknown) => string;

    onClick?: () => void;
};

export function Chip(props: Readonly<PropsWithChildren<Props>>): JSX.Element {
    const { children, ...rest } = props;
    return (
        <Spicetify.ReactComponent.Chip {...rest}>
            {children}
        </Spicetify.ReactComponent.Chip>
    );
}
