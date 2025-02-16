import { SpotifyIcon } from '@shared/components/ui/SpotifyIcon/SpotifyIcon';
import { getTranslation } from '@shared/utils/translations.utils';
import React, { type MouseEvent } from 'react';

export type Props = {
    size: Spicetify.ReactComponent.ButtonProps['buttonSize'];
    disabled?: boolean;
    onClick: () => void;
};

export function PlayButton(props: Readonly<Props>): JSX.Element {
    let legacySize: Spicetify.ReactComponent.ButtonProps['size'] | undefined;

    if (props.size === 'lg') {
        legacySize = 'large';
    } else if (props.size === 'md') {
        legacySize = 'medium';
    } else if (props.size === 'sm') {
        legacySize = 'small';
    }

    return (
        <Spicetify.ReactComponent.ButtonPrimary
            aria-label={getTranslation(['play'])}
            size={legacySize}
            buttonSize={props.size}
            disabled={props.disabled}
            onClick={(e: MouseEvent) => {
                e.stopPropagation();
                props.onClick();
            }}
            iconOnly={<SpotifyIcon icon="play" />}
        ></Spicetify.ReactComponent.ButtonPrimary>
    );
}
