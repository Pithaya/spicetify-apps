import { Settings } from 'lucide-react';
import React, { type CSSProperties } from 'react';
import styles from './SettingsButton.module.scss';
import { SettingsModal } from './SettingsModal';

export function SettingsButton(): JSX.Element {
    const buttonSize = 50;
    const borderRadius = 15;
    const iconSize = 20;

    const style: CSSProperties = {
        height: `${buttonSize.toFixed()}px`,
        width: `${buttonSize.toFixed()}px`,
        borderRadius: `${borderRadius.toFixed()}px`,
    };

    function onClick(): void {
        Spicetify.PopupModal.display({
            title: 'Jukebox settings',
            content: <SettingsModal />,
            isLarge: true,
        });
    }

    return (
        <button
            className={styles['settings-button']}
            onClick={() => {
                onClick();
            }}
            style={style}
        >
            <Settings stroke="currentColor" size={iconSize}></Settings>
        </button>
    );
}
