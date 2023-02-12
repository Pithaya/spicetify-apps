import { ConversionMode } from '../models/conversion-mode.enum';
import { RomajiSystem } from '../models/romaji-system.enum';
import { TargetSyllabary } from '../models/target-syllabary.enum';

/**
 * Manage localStorage settings.
 */
export class KuroshiroSettingsService {
    private readonly targetSyllabarySettingId: string = 'kuroshiro:syllabary';
    private readonly conversionModeSettingId: string =
        'kuroshiro:conversion-mode';
    private readonly romajiSystemSettingId: string = 'kuroshiro:romaji-system';

    public get targetSyllabary(): TargetSyllabary {
        return (
            (Spicetify.LocalStorage.get(
                this.targetSyllabarySettingId
            ) as TargetSyllabary) ?? TargetSyllabary.Romaji
        );
    }

    public set targetSyllabary(value: TargetSyllabary) {
        Spicetify.LocalStorage.set(this.targetSyllabarySettingId, value);
    }

    public get conversionMode(): ConversionMode {
        return (
            (Spicetify.LocalStorage.get(
                this.conversionModeSettingId
            ) as ConversionMode) ?? ConversionMode.Spaced
        );
    }

    public set conversionMode(value: ConversionMode) {
        Spicetify.LocalStorage.set(this.conversionModeSettingId, value);
    }

    public get romajiSystem(): RomajiSystem {
        return (
            (Spicetify.LocalStorage.get(
                this.romajiSystemSettingId
            ) as RomajiSystem) ?? RomajiSystem.Passport
        );
    }

    public set romajiSystem(value: RomajiSystem) {
        Spicetify.LocalStorage.set(this.romajiSystemSettingId, value);
    }
}
