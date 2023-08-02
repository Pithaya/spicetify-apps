import { registerPrintLatestMessagesItem } from '@shared/debug';
import { waitForSpicetify } from '@shared/utils';

async function main() {
    await waitForSpicetify();

    registerPrintLatestMessagesItem();
}

export default main;
