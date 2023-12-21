import { addUpdateChecker, getPlatform, waitForSpicetify } from '@shared/utils';
import { LocalTracksService } from '../services/local-tracks-service';
import { version } from '../../package.json';

void (async () => {
    // Necessary to share the same instance between the extension and the custom app
    window.localTracksService = new LocalTracksService();

    await waitForSpicetify();

    const rebuildMenuItem = new Spicetify.Menu.Item(
        'Rebuild local album cache',
        false,
        async () => {
            await window.localTracksService.reset();
        },
    );

    const clearCacheMenuItem = new Spicetify.Menu.Item(
        'Clear local album cache',
        false,
        async () => {
            await window.localTracksService.clearCache();
        },
    );

    const handlePathnameChange = (pathname: string): void => {
        if (pathname.includes('better-local-files')) {
            rebuildMenuItem.register();
            clearCacheMenuItem.register();
        } else {
            rebuildMenuItem.deregister();
            clearCacheMenuItem.deregister();
        }
    };

    handlePathnameChange(getPlatform().History.location.pathname);

    getPlatform().History.listen((event) => {
        handlePathnameChange(event.pathname);
    });

    await addUpdateChecker(version, 'better-local-files');
})();
