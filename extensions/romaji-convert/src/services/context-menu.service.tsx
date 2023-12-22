import { getSelectedElementName } from '@shared/utils';
import {
    settingsService,
    type KuroshiroSettingsService,
} from './kuroshiro-settings.service';
import { kuroshiroService, type KuroshiroService } from './kuroshiro.service';
import Kuroshiro from 'kuroshiro';
import i18next from 'i18next';
import { MENU_ICON } from '../models/constants';
import React from 'react';

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

    private readonly settingsService: KuroshiroSettingsService;
    private readonly kuroshiroService: KuroshiroService;

    constructor() {
        this.settingsService = settingsService;
        this.kuroshiroService = kuroshiroService;
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
            async () => {
                await this.convert();
            },
            () => {
                const selectedName = getSelectedElementName();
                this.selectedElementName = selectedName ?? '';
                return Kuroshiro.Util.hasJapanese(this.selectedElementName);
            },
            MENU_ICON as any,
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

        const result = await this.kuroshiroService.convert(
            this.selectedElementName,
        );

        Spicetify.showNotification(
            <div>
                <p
                    style={{
                        fontSize: `${this.settingsService.notificationFontSize}px`,
                    }}
                    dangerouslySetInnerHTML={{ __html: result }}
                ></p>
            </div>,
            false,
            this.settingsService.notificationTimeout,
        );
    }
}

export const contextMenuService: ContextMenuService = new ContextMenuService();
