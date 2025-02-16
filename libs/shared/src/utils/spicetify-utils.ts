import type { Platform } from '../platform/platform';

/**
 * Wait for Spicetify to load.
 */
export async function waitForSpicetify(): Promise<void> {
    await new Promise<void>((resolve) => {
        Spicetify.Events.platformLoaded.on(() => {
            resolve();
        });
    });
}

/**
 * Wait for a callback to return a value.
 */
export async function waitFor<T>(getValue: () => T | undefined): Promise<T> {
    let value = getValue();

    while (value === undefined) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        value = getValue();
    }

    return value;
}

/**
 * Get typed Spicetify.Platform.
 * @returns The Platform object.
 */
export function getPlatform(): Platform {
    return Spicetify.Platform as Platform;
}
