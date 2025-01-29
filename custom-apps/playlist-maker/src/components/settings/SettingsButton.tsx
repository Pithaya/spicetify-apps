import { Settings } from 'lucide-react';
import React from 'react';
import { SettingsModal } from './SettingsModal';

export function SettingsButton(): JSX.Element {
    return (
        <div className="flex flex-col items-center">
            <Spicetify.ReactComponent.TooltipWrapper
                label="Settings"
                placement="right"
            >
                <Spicetify.ReactComponent.ButtonTertiary
                    aria-label="Settings"
                    iconOnly={() => (
                        <Settings
                            size={20}
                            strokeWidth={1.5}
                            className="text-spice-text"
                        />
                    )}
                    buttonSize="sm"
                    onClick={() => {
                        Spicetify.PopupModal.display({
                            title: 'Settings',
                            content: React.createElement(SettingsModal) as any,
                            isLarge: true,
                        });
                    }}
                    className="p-1"
                ></Spicetify.ReactComponent.ButtonTertiary>
            </Spicetify.ReactComponent.TooltipWrapper>
        </div>
    );
}
