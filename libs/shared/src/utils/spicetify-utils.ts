/**
 * Wait for Spicetify to load.
 */
export async function waitForSpicetify(): Promise<void> {
    while (!Spicetify?.Platform) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }
}
