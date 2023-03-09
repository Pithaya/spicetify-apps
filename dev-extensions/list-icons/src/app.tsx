import { listIcons } from '@shared';

async function main() {
    while (!Spicetify?.Platform) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    listIcons();
}

export default main;
