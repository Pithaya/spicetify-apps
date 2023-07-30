import { getSelectedElementName } from '@shared/utils';
import { KuroshiroSettingsService } from './kuroshiro-settings.service';
import { KuroshiroService } from './kuroshiro.service';
import { ServicesContainer } from './services-container';
import Kuroshiro from 'kuroshiro';
import i18next from 'i18next';

/**
 * The "convert to" context menu.
 */
export class ContextMenuService {
    /**
     * Reference to the context menu item.
     */
    private contextMenuItem: Spicetify.ContextMenu.Item | null = null;

    /**
     * The name of the selected element.
     */
    private selectedElementName = '';

    /**
     * 'languages' icon from Lucide icons.
     */
    private readonly menuIcon: string = `<svg xmlns="http://www.w3.org/2000/svg" role="img" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="--darkreader-inline-stroke: currentColor;" data-darkreader-inline-stroke=""><path d="m5 8 6 6"></path><path d="m4 14 6-6 2-3"></path><path d="M2 5h12"></path><path d="M7 2h1"></path><path d="m22 22-5-10-5 10"></path><path d="M14 18h6"></path></svg>`;

    private readonly settingsService: KuroshiroSettingsService;
    private readonly kuroshiroService: KuroshiroService;

    constructor() {
        this.settingsService = ServicesContainer.settings;
        this.kuroshiroService = ServicesContainer.kuroshiro;
    }

    /**
     * Registers the context menu, or updates it if it is already registered.
     */
    public registerOrUpdate(): void {
        if (this.contextMenuItem != null) {
            this.contextMenuItem.deregister();
        }

        this.contextMenuItem = new Spicetify.ContextMenu.Item(
            i18next.t('contextMenu.name', {
                syllabary: this.settingsService.targetSyllabary,
            }),
            () => this.convert(),
            () => {
                const selectedName = getSelectedElementName();
                this.selectedElementName = selectedName ?? '';
                return Kuroshiro.Util.hasJapanese(this.selectedElementName);
            },
            this.menuIcon as any
        );

        this.contextMenuItem.register();
    }

    /**
     * Convert and show the selected element's name.
     */
    private async convert(): Promise<void> {
        if (this.selectedElementName === '') {
            Spicetify.showNotification(i18next.t('contextMenu.error'), true);
        }

        let result = await this.kuroshiroService.convert(
            this.selectedElementName
        );

        Spicetify.showNotification(
            `<div>
                <p style="font-size:${this.settingsService.notificationFontSize}px;">${result}</p>
            </div>`,
            false,
            this.settingsService.notificationTimeout
        );
    }
}
