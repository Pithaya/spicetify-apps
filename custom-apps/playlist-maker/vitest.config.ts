import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
    resolve: {
        alias: {
            '@shared': `${root}../../libs/shared/src`,
            'custom-apps/playlist-maker/src': `${root}src`,
        },
    },
    test: {
        setupFiles: ['./vitest.setup.ts'],
    },
});
