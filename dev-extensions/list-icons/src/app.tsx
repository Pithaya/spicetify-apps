import { listIcons } from '@shared/debug/list-icons';
import { registerProxyMenuItem } from '@shared/debug/register-proxy';
import { waitForSpicetify } from '@shared/utils/spicetify-utils';

async function main(): Promise<void> {
    await waitForSpicetify();

    listIcons();
    registerProxyMenuItem();
}

export default main;
