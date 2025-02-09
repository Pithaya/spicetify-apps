import { registerProxy } from '@shared/debug/register-proxy';
import type { LibraryAPI } from '@shared/platform/library';
import {
    getPlatformApiOrThrow,
    waitForSpicetify,
} from '@shared/utils/spicetify-utils';
import { addUpdateChecker } from '@shared/utils/version-utils';
import { version } from '../../package.json';

void (async () => {
    await waitForSpicetify();
    await addUpdateChecker(version, 'playlist-maker');
    registerProxy<LibraryAPI>(
        getPlatformApiOrThrow<LibraryAPI>('LibraryAPI'),
        'LibraryAPI',
    );
})();
