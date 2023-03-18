import styles from '../../css/app.module.scss';
import React, { CSSProperties } from 'react';
import { Settings } from 'lucide-react';
import react from 'react';
import { SettingsModal } from './settings-modal.component';

export function SettingsButton() {
    const buttonSize = 50;
    const borderRadius = 15;
    const iconSize = 20;

    const style: CSSProperties = {
        height: `${buttonSize}px`,
        width: `${buttonSize}px`,
        borderRadius: `${borderRadius}px`,
    };

    function onClick() {
        Spicetify.PopupModal.display({
            title: 'Jukebox settings',
            content: react.createElement(SettingsModal) as any,
            isLarge: true,
        });
    }

    return (
        <button
            className={styles['settings-button']}
            onClick={(e) => {
                onClick();
            }}
            style={style}
        >
            <Settings stroke="currentColor" size={iconSize}></Settings>
        </button>
    );
}
