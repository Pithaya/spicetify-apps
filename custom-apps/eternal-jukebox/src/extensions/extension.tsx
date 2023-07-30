import { addUpdateChecker, waitForElement } from '@shared/utils';
import { Jukebox } from '../models/jukebox';
import { version } from '../../package.json';

// TODO: Add i18n

(async () => {
    window.jukebox = new Jukebox();

    while (!Spicetify?.Platform) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    try {
        const element = await waitForElement('.player-controls__right');

        const reactHelper = await import('../helpers/react-helper');
        reactHelper.ReactHelper.registerPaybarButton(element);

        await addUpdateChecker(version, 'eternal-jukebox');
    } catch (error) {
        console.error(error);
        Spicetify.showNotification(
            'Failed to register the eternal jukebox playbar button',
            true
        );
    }
})();
