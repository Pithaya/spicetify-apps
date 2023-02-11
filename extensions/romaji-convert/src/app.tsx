import React from 'react';
import { SettingsModal } from './components/settings-modal.component.js';
import { ServicesContainer } from './services/services-container.js';

async function main(): Promise<void> {
    while (!Spicetify?.Platform) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const react = Spicetify.React as typeof React;

    // Init services
    ServicesContainer.kuroshiro.init();

    // TODO: Add translations

    // Add settings menu
    new Spicetify.Menu.Item('Japanese conversion settings', false, () =>
        Spicetify.PopupModal.display({
            title: 'Japanese conversion settings',
            content: react.createElement(SettingsModal) as any,
            isLarge: true,
        })
    ).register();

    // Add context menu
    ServicesContainer.contextMenu.registerOrUpdate();
}

export default main;
