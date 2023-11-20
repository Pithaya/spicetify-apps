import React from 'react';
import { Play } from 'lucide-react';
import { getTranslation } from '../../../helpers/translations-helper';

export interface IProps {
    onClick: () => void;
}

export function PlayButton(props: Readonly<IProps>) {
    return (
        <Spicetify.ReactComponent.ButtonPrimary
            aria-label={getTranslation(['play'])}
            buttonSize={'lg'}
            onClick={(e: any) => {
                e.stopPropagation();
                props.onClick();
            }}
            iconOnly={() => (
                <Play
                    fill="var(--spice-main)"
                    stroke="var(--spice-main)"
                    size={22}
                    style={{ marginLeft: '2px' }}
                ></Play>
            )}
        ></Spicetify.ReactComponent.ButtonPrimary>
    );
}
