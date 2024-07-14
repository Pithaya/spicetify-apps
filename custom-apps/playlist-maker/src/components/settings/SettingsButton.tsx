import React from 'react';
import styles from './SettingsButton.module.scss';
import { Settings } from 'lucide-react';
import { SettingsModal } from './SettingsModal';

export function SettingsButton(): JSX.Element {
    return (
        <div className={styles['settings-panel']}>
            <Spicetify.ReactComponent.ButtonTertiary
                iconOnly={() => <Settings size={20} strokeWidth={1.5} />}
                buttonSize="sm"
                onClick={() => {
                    Spicetify.PopupModal.display({
                        title: 'Settings',
                        content: React.createElement(SettingsModal) as any,
                        isLarge: true,
                    });
                }}
                className={styles['settings-button']}
            ></Spicetify.ReactComponent.ButtonTertiary>
        </div>
    );
}
