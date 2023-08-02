import { listIcons } from '@shared/debug';
import { waitForSpicetify } from '@shared/utils';

async function main() {
    await waitForSpicetify();

    listIcons();
}

export default main;
