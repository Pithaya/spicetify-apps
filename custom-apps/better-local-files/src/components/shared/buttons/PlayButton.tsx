import React from 'react';
import { getTranslation } from '../../../utils/translations.utils';
import { SpotifyIcon } from '@shared/components/ui/SpotifyIcon/SpotifyIcon';

export type Props = {
    size: Spicetify.ReactComponent.ButtonProps['buttonSize'];
    onClick: () => void;
};

export function PlayButton(props: Readonly<Props>): JSX.Element {
    return (
        <Spicetify.ReactComponent.ButtonPrimary
            aria-label={getTranslation(['play'])}
            buttonSize={props.size}
            onClick={(e: any) => {
                e.stopPropagation();
                props.onClick();
            }}
            iconOnly={() => <SpotifyIcon icon="play" />}
        ></Spicetify.ReactComponent.ButtonPrimary>
    );
}
