/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { waitForSpicetify } from '@shared/utils/spicetify-utils';
import { addUpdateChecker } from '@shared/utils/version-utils';
import { version } from '../../package.json';
import { migrateLegacyWorkflows } from '../utils/storage-utils';

void (async () => {
    await waitForSpicetify();
    await addUpdateChecker(version, 'playlist-maker');
    await migrateLegacyWorkflows();
})();
