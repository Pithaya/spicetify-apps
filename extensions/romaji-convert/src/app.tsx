import Kuroshiro from 'kuroshiro';
import { createKuroshiro } from './helpers/kuroshiro-helpers.js';
import { KuroshiroSettings } from './kuroshiro-settings.js';
import { getSelectedElementName } from '@shared';

let kuroshiro: Kuroshiro;
let settings: KuroshiroSettings;
let contextMenuItem: Spicetify.ContextMenu.Item | null = null;
let lastSelectedElementName = '';

// 'languages' icon from Lucide
const menuIcon: string = `<svg xmlns="http://www.w3.org/2000/svg" role="img" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="--darkreader-inline-stroke: currentColor;" data-darkreader-inline-stroke=""><path d="m5 8 6 6"></path><path d="m4 14 6-6 2-3"></path><path d="M2 5h12"></path><path d="M7 2h1"></path><path d="m22 22-5-10-5 10"></path><path d="M14 18h6"></path></svg>`;

async function convert(value: string): Promise<void> {
    let result = await kuroshiro.convert(value, {
        to: settings.targetSyllabary,
        mode: settings.conversionMode,
        romajiSystem: settings.romajiSystem,
    });

    Spicetify.showNotification(result);
}

/**
 * Update the 'convert to' menu item.
 */
function updateContextMenuItem(): void {
    if (contextMenuItem != null) {
        contextMenuItem.deregister();
    }

    contextMenuItem = new Spicetify.ContextMenu.Item(
        `Convert to ${settings.targetSyllabaryLabel}`,
        () => convert(lastSelectedElementName),
        () => {
            const selectedName = getSelectedElementName();
            lastSelectedElementName = selectedName ?? '';
            return Kuroshiro.Util.hasJapanese(lastSelectedElementName);
        },
        menuIcon as any
    );

    contextMenuItem.register();
}

async function main(): Promise<void> {
    while (!Spicetify?.Platform) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Init dependencies
    kuroshiro = await createKuroshiro();

    // Init settings and context menu
    settings = new KuroshiroSettings();
    settings.onTargetSyllabaryChange = updateContextMenuItem;

    updateContextMenuItem();
}

export default main;
