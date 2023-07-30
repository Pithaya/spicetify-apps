import { registerPrintLatestMessagesItem } from '@shared/debug';

async function main() {
    while (!Spicetify?.Platform) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    registerPrintLatestMessagesItem();
}

export default main;
