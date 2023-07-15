import { compare } from 'compare-versions';
import { HistoryEntry, Platform } from '../platform';

async function getRemoteVersion(appName: string): Promise<string> {
    const branch = 'main';
    const response = await fetch(
        `https://raw.githubusercontent.com/Pithaya/spicetify-apps/${branch}/custom-apps/${appName}/src/version.ts`
    );

    const text = await response.text();
    const matches = text.match(/export const version = '(.+)';/);

    return matches?.[1] ?? '0.0.0';
}

async function isUpToDate(
    localVersion: string,
    appName: string
): Promise<boolean> {
    const remoteVersion = await getRemoteVersion(appName);
    return compare(localVersion, remoteVersion, '>=');
}

/**
 * Add a listener to the history object to check for updates when the user navigates to the custom app.
 * This will show a message on first navigation to the custom app.
 * @param localVersion The current local version of the custom app.
 * @param appName The name of the custom app.
 * @param updateMessage The message to show when an update is available.
 */
export async function addUpdateChecker(
    localVersion: string,
    appName: string
): Promise<void> {
    const history = Platform.History;

    const checkVersion = async () => {
        if (!(await isUpToDate(localVersion, appName))) {
            Spicetify.showNotification(
                '📢 A new version of the custom app is available.',
                false,
                5000
            );
        }
    };

    if (history.location.pathname === `/${appName}`) {
        await checkVersion();
    } else {
        let unsubscribe: (() => void) | null = null;

        unsubscribe = history.listen(async (e: HistoryEntry) => {
            if (e.pathname === `/${appName}`) {
                await checkVersion();

                unsubscribe?.();
            }
        });
    }
}