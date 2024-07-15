import { waitForSpicetify } from '@shared/utils/spicetify-utils';
import { waitForElement } from '@shared/utils/dom-utils';
import { renderElement } from '@shared/utils/react-utils';
import { addUpdateChecker } from '@shared/utils/version-utils';
import { Jukebox } from '../models/jukebox';
import { version } from '../../package.json';
import { PlaybarButton } from '../components/PlaybarButton';
import React from 'react';

// TODO: Add i18n

void (async () => {
    window.jukebox = new Jukebox();

    await waitForSpicetify();

    let element: Element | null = null;

    try {
        element = await waitForElement('.player-controls__right');
    } catch {}

    // Fallback to the main repeat button if the player controls are not found
    if (element === null) {
        try {
            const button = await waitForElement('.main-repeatButton-button');
            element = button.parentElement;
        } catch {}
    }

    try {
        if (element === null) {
            throw new Error('Container element not found');
        }

        renderElement(<PlaybarButton />, element);

        await addUpdateChecker(version, 'eternal-jukebox');
    } catch (error) {
        console.error(error);
        Spicetify.showNotification(
            'Failed to register the eternal jukebox playbar button',
            true,
        );
    }
})();
