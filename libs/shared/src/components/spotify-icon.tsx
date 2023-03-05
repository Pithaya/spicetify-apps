import React from 'react';

export interface SpotifyIconProps
    extends Pick<
        Spicetify.ReactComponent.IconComponentProps,
        'iconSize' | 'color'
    > {
    icon: Spicetify.ContextMenu.Icon;
}

export function SpotifyIcon(props: SpotifyIconProps) {
    return (
        <Spicetify.ReactComponent.IconComponent
            iconSize={props.iconSize}
            color={props.color}
            title={props.icon}
            dangerouslySetInnerHTML={{
                __html: (Spicetify.SVGIcons as any)[props.icon],
            }}
        ></Spicetify.ReactComponent.IconComponent>
    );
}
