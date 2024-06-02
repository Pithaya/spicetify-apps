import { waitForSpicetify } from '@shared/utils/spicetify-utils';
import { addUpdateChecker } from '@shared/utils/version-utils';
import { version } from '../../package.json';

void (async () => {
    await waitForSpicetify();
    await addUpdateChecker(version, 'playlist-maker');
})();
