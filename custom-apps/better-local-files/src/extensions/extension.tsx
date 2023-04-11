import { Platform } from '@shared';
import { LocalTracksService } from '../services/local-tracks-service';

(async () => {
    // Necessary to share the same instance between the extension and the custom app
    window.localTracksService = new LocalTracksService();

    while (!Spicetify?.Platform) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const menuItem = new Spicetify.Menu.Item(
        'Rebuild local album cache',
        false,
        () => window.localTracksService.reset()
    );

    const handlePathnameChange = (pathname: string) => {
        if (pathname.includes('better-local-files')) {
            menuItem.register();
        } else {
            menuItem.deregister();
        }
    };

    handlePathnameChange(Platform.History.location.pathname);

    Platform.History.listen((event) => {
        handlePathnameChange(event.pathname);
    });
})();
