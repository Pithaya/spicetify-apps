import { KuroshiroBuilder } from '../helpers/kuroshiro-builder';
import { KuroshiroSettingsService } from './kuroshiro-settings.service';
import { ServicesContainer } from './services-container';

export class KuroshiroService {
    private kuroshiro: Kuroshiro | null = null;
    private readonly settingsService: KuroshiroSettingsService;

    constructor() {
        this.settingsService = ServicesContainer.settings;
    }

    /**
     * Init the Kuroshiro service.
     */
    public async init(): Promise<void> {
        this.kuroshiro = await new KuroshiroBuilder().createKuroshiro();
    }

    /**
     * Convert a value using the stored settings.
     * @param value The japanese value to convert.
     */
    public async convert(value: string): Promise<string> {
        if (this.kuroshiro === null) {
            console.error(
                "Property 'kuroshiro' is null. Call 'init' before using the service."
            );
            return '';
        }

        return await this.kuroshiro.convert(value, {
            to: this.settingsService.targetSyllabary,
            mode: this.settingsService.conversionMode,
            romajiSystem: this.settingsService.romajiSystem,
        });
    }
}
