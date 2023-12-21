import React from 'react';
import { Play } from 'lucide-react';
import { getTranslation } from '../../../helpers/translations-helper';

export interface IProps {
    size: Spicetify.ReactComponent.ButtonProps['buttonSize'];
    onClick: () => void;
}

export function PlayButton(props: Readonly<IProps>) {
    let iconSize: number;
    let style: React.CSSProperties;

    switch (props.size) {
        case 'sm':
            iconSize = 16;
            style = { marginLeft: '2px' };
            break;
        case 'md':
            iconSize = 20;
            style = { marginLeft: '4px', marginTop: '2px' };
            break;
        case 'lg':
            iconSize = 22;
            style = { marginLeft: '2px' };
            break;
    }

    return (
        <Spicetify.ReactComponent.ButtonPrimary
            aria-label={getTranslation(['play'])}
            buttonSize={props.size}
            onClick={(e: any) => {
                e.stopPropagation();
                props.onClick();
            }}
            iconOnly={() => (
                <Play
                    fill="var(--spice-main)"
                    stroke="var(--spice-main)"
                    size={iconSize}
                    style={style}
                ></Play>
            )}
        ></Spicetify.ReactComponent.ButtonPrimary>
    );
}
