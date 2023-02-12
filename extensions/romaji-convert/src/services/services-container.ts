import { ContextMenuService } from './context-menu.service';
import { KuroshiroSettingsService } from './kuroshiro-settings.service';
import { KuroshiroService } from './kuroshiro.service';

export class ServicesContainer {
    public static settings: KuroshiroSettingsService =
        new KuroshiroSettingsService();
    public static kuroshiro: KuroshiroService = new KuroshiroService();
    public static contextMenu: ContextMenuService = new ContextMenuService();
}
