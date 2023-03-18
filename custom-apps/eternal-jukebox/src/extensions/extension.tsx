import { waitForElement } from '@shared';
import React from 'react';
import ReactDOM from 'react-dom';
import { PlaybarButton } from '../components/playbar-button.component';
import { Jukebox } from '../models/jukebox';

// TODO: Add i18n

(async () => {
    window.jukebox = new Jukebox();

    while (!Spicetify?.Platform) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    try {
        const element = await waitForElement('.player-controls__right', 10000);

        const reactDom = Spicetify.ReactDOM as typeof ReactDOM;

        // TODO: createRoot + root.render() if React updates to v18
        reactDom.render(
            reactDom.createPortal(<PlaybarButton />, element),
            document.createElement('div')
        );
    } catch (error) {
        console.error(error);
        Spicetify.showNotification(
            'Failed to register the eternal jukebox playbar button',
            true
        );
    }
})();
