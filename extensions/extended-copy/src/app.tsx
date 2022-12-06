async function main() {
    while (!Spicetify?.Platform) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    new Spicetify.ContextMenu.SubMenu('Copy', [
        new Spicetify.ContextMenu.Item(
            'Copy name',
            (uris) => {},
            () => true
        ),
        new Spicetify.ContextMenu.Item(
            'Copy URI',
            (uris) => {},
            () => true,
            'external-link'
        ),
        new Spicetify.ContextMenu.Item(
            'Copy data',
            (uris) => {},
            () => true
        ),
    ]).register();
}

export default main;
