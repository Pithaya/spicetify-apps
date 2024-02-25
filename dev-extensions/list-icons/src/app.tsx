import { listIcons } from '@shared/debug/list-icons';
import { waitForSpicetify } from '@shared/utils/spicetify-utils';

async function main(): Promise<void> {
    await waitForSpicetify();

    listIcons();
}

export default main;
