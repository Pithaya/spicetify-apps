import { getPrettifiedLatestMessages } from '../cosmos';

/**
 * Add an item in the context menu to show the last CosmosAsync messages.
 */
export function registerPrintLatestMessagesItem(): void {
    new Spicetify.ContextMenu.Item(
        'Print latest messages',
        async () => {
            console.log(await getPrettifiedLatestMessages());
            Spicetify.showNotification('Latest messages printed to console.');
        },
        () => true
    ).register();
}
