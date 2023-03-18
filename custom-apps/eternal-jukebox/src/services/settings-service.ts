import {
    JukeboxSettings,
    JukeboxStoredSettings,
} from '../models/jukebox-settings';

export class SettingsService {
    private static readonly settingId: string = 'jukebox:settings';

    public static get settings(): JukeboxSettings {
        const storageValue = Spicetify.LocalStorage.get(this.settingId);

        if (storageValue == null) {
            return new JukeboxSettings();
        }

        const parsedValue: JukeboxStoredSettings = JSON.parse(storageValue);
        return JukeboxSettings.fromPartial(parsedValue);
    }

    public static set settings(settings: JukeboxSettings) {
        const storedSettings: JukeboxStoredSettings = settings.toPartial();
        Spicetify.LocalStorage.set(
            this.settingId,
            JSON.stringify(storedSettings)
        );
    }
}
