import type { Platform } from '../platform/platform';

/**
 * Wait for Spicetify to load.
 */
export async function waitForSpicetify(): Promise<void> {
    while (!Spicetify?.Platform) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }
}

/**
 * Get typed Spicetify.Platform.
 * @returns The Platform object.
 */
export function getPlatform(): Platform {
    return Spicetify.Platform;
}
