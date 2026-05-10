import { Settings } from 'lucide-react';
import React from 'react';
import { SettingsModal } from './SettingsModal';

export function SettingsButton(): JSX.Element {
    return (
        <div className="tw:flex tw:flex-col tw:items-center">
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
                            className="tw:text-spice-text"
                        />
                    )}
                    buttonSize="sm"
                    onClick={() => {
                        Spicetify.PopupModal.display({
                            title: 'Settings',
                            content: React.createElement(SettingsModal),
                            isLarge: true,
                        });
                    }}
                    className="tw:p-1"
                ></Spicetify.ReactComponent.ButtonTertiary>
            </Spicetify.ReactComponent.TooltipWrapper>
        </div>
    );
}
