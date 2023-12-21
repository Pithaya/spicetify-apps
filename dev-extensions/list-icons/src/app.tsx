import { listIcons } from '@shared/debug';
import { waitForSpicetify } from '@shared/utils';

async function main(): Promise<void> {
    await waitForSpicetify();

    listIcons();
}

export default main;
