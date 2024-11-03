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

        const styles = `
        svg.made-for-you-icon {
            stroke-width: 2px !important;
        }

        button.jukebox-toggle {
            border-color: var(--text-base);
        }

        button.jukebox-toggle.active {
            color: var(--spice-button-active);
        }

        button.jukebox-toggle:focus-visible {
            border-width: 2px;
            border-style: solid;
        }

        button.jukebox-toggle:focus::after {
            border-color: transparent !important;
        }

        button.jukebox-toggle.active:before {
            background-color: currentcolor;
            border-radius: 50%;
            bottom: 0;
            content: "";
            display: block;
            left: 50%;
            position: absolute;
            width: 4px;
            inline-size: 4px;
            height: 4px;
            -webkit-transform: translateX(-50%);
            transform: translateX(-50%);
        }
    `;

        const styleSheet = document.createElement('style');
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);

        renderElement(<PlaybarButton className="jukebox-toggle" />, element);

        await addUpdateChecker(version, 'eternal-jukebox');
    } catch (error) {
        console.error(error);
        Spicetify.showNotification(
            'Failed to register the eternal jukebox playbar button',
            true,
        );
    }
})();
