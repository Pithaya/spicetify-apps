import { SettingsSection } from "spcr-settings";

export type TargetSyllabary = 'hiragana' | 'katakana' | 'romaji';
export type ConversionMode = 'normal' | 'spaced' | 'okurigana' | 'furigana';
export type RomajiSystem = 'nippon' | 'passport' | 'hepburn';

export class KuroshiroSettings {
    private readonly targetSyllabarySettingId: string = 'kuroshiro-to-dropdown';
    private readonly conversionModeSettingId: string = 'kuroshiro-mode-dropdown';
    private readonly romajiSystemSettingId: string = 'kuroshiro-system-dropdown';

    private readonly settingsSection: SettingsSection;

    public onTargetSyllabaryChange?: () => void;

    constructor() {
        this.settingsSection = new SettingsSection(
            'Kuroshiro',
            'settings-kuroshiro'
        );

        this.settingsSection.addDropDown(
            this.targetSyllabarySettingId,
            'Target syllabary',
            ['Hiragana', 'Katakana', 'Romaji'],
            2,
            () => { },
            {
                onChange: () => {
                    if (!!this.onTargetSyllabaryChange) {
                        this.onTargetSyllabaryChange();
                    }
                },
            }
        );

        this.settingsSection.addDropDown(
            this.conversionModeSettingId,
            'Conversion mode',
            ['Normal', 'Spaced', 'Okurigana', 'Furigana'],
            1
        );

        this.settingsSection.addDropDown(
            this.romajiSystemSettingId,
            'Romaji system',
            ['Nippon', 'Passport', 'Hepburn'],
            1
        );

        this.settingsSection.pushSettings();
    }

    public get targetSyllabaryLabel(): string {
        return this.settingsSection.getFieldValue(this.targetSyllabarySettingId) ?? 'Romaji';
    }

    public get targetSyllabary(): TargetSyllabary {
        return this.targetSyllabaryLabel.toLowerCase() as TargetSyllabary;
    }

    public get conversionModeLabel(): string {
        return this.settingsSection.getFieldValue(this.conversionModeSettingId) ?? 'Spaced';
    }

    public get conversionMode(): ConversionMode {
        return this.conversionModeLabel.toLowerCase() as ConversionMode;
    }

    public get romajiSystemLabel(): string {
        return this.settingsSection.getFieldValue(this.romajiSystemSettingId) ?? 'Passport';
    }

    public get romajiSystem(): RomajiSystem {
        return this.romajiSystemLabel.toLowerCase() as RomajiSystem;
    }
}