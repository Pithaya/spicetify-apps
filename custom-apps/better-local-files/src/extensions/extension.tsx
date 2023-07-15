import { Platform, addUpdateChecker } from '@shared';
import { LocalTracksService } from '../services/local-tracks-service';
import { VERSION } from '../version';

(async () => {
    // Necessary to share the same instance between the extension and the custom app
    window.localTracksService = new LocalTracksService();

    while (!Spicetify?.Platform) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const rebuildMenuItem = new Spicetify.Menu.Item(
        'Rebuild local album cache',
        false,
        () => window.localTracksService.reset()
    );

    const clearCacheMenuItem = new Spicetify.Menu.Item(
        'Clear local album cache',
        false,
        () => window.localTracksService.clearCache()
    );

    const handlePathnameChange = (pathname: string) => {
        if (pathname.includes('better-local-files')) {
            rebuildMenuItem.register();
            clearCacheMenuItem.register();
        } else {
            rebuildMenuItem.deregister();
            clearCacheMenuItem.deregister();
        }
    };

    handlePathnameChange(Platform.History.location.pathname);

    Platform.History.listen((event) => {
        handlePathnameChange(event.pathname);
    });

    await addUpdateChecker(VERSION, 'better-local-files');
})();
