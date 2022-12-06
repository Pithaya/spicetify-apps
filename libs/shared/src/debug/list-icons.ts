/**
 * List all the existing icons in the context menu.
 */
export function listIcons(): void {
    for (const [iconName, icon] of Object.entries(Spicetify.SVGIcons)) {
        new Spicetify.ContextMenu.Item(
            iconName,
            () => {},
            () => true,
            `<svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">${icon}</svg>` as any
        ).register();
    }
}
