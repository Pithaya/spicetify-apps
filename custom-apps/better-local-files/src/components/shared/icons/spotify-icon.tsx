import React from 'react';

export type Props = Spicetify.ReactComponent.IconComponentProps & {
    icon: Spicetify.Icon;
};

export function SpotifyIcon(props: Readonly<Props>): JSX.Element {
    return (
        <Spicetify.ReactComponent.IconComponent
            iconSize={props.iconSize}
            semanticColor={props.semanticColor}
            dangerouslySetInnerHTML={{
                __html: Spicetify.SVGIcons[props.icon],
            }}
            viewBox="0 0 16 16"
        ></Spicetify.ReactComponent.IconComponent>
    );
}
