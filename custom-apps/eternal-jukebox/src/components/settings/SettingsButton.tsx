import { Settings } from 'lucide-react';
import React, { type CSSProperties } from 'react';
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
            className="flex cursor-pointer items-center justify-center border-none bg-(--spice-sidebar) text-(--spice-subtext) transition-colors hover:bg-(--spice-button-disabled)"
            onClick={onClick}
            style={style}
        >
            <Settings stroke="currentColor" size={iconSize}></Settings>
        </button>
    );
}
