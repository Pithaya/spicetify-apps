import React from 'react';

export type Props = Spicetify.ReactComponent.IconComponentProps & {
    icon?: Spicetify.Icon;
    iconPath?: string;
};

export function SpotifyIcon(props: Readonly<Props>): JSX.Element {
    if (props.icon) {
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
    } else if (props.iconPath) {
        return (
            <Spicetify.ReactComponent.IconComponent
                iconSize={props.iconSize}
                semanticColor={props.semanticColor}
                dangerouslySetInnerHTML={{
                    __html: props.iconPath,
                }}
                viewBox="0 0 16 16"
            ></Spicetify.ReactComponent.IconComponent>
        );
    }

    return <></>;
}
