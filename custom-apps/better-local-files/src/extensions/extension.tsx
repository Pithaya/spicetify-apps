import { registerProxy } from '@shared';

(async () => {
    while (!Spicetify?.showNotification) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    //registerProxy(Spicetify.Platform.LocalFilesAPI, 'LocalFilesAPI');
})();
