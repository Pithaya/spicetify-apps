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

    try {
        const element = await waitForElement('.main-repeatButton-button');

        if (element.parentElement === null) {
            throw new Error('Parent element not found');
        }

        renderElement(<PlaybarButton />, element.parentElement);

        await addUpdateChecker(version, 'eternal-jukebox');
    } catch (error) {
        console.error(error);
        Spicetify.showNotification(
            'Failed to register the eternal jukebox playbar button',
            true,
        );
    }
})();
