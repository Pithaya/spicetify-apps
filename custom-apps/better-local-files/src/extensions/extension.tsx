import { Platform } from '@shared';
import { LocalTracksService } from '../services/local-tracks-service';

(async () => {
    while (!Spicetify?.Platform) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const menuItem = new Spicetify.Menu.Item(
        'Rebuild local album cache',
        false,
        () => LocalTracksService.reset()
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
