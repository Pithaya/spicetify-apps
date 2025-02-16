import type { Translations } from '@shared/platform/translations';
import { getPlatform } from '@shared/utils/spicetify-utils';

export function getTranslation(keys: string[], ...params: string[]): string {
    const translations = getPlatform().Translations;

    let valueObject: Translations | string = translations;

    for (const key of keys) {
        if (typeof valueObject === 'string') {
            throw new Error(`Key "${key}" not found in translations.`);
        }

        valueObject = valueObject[key] as Translations | string;
    }

    let value = valueObject as string;

    params.forEach((param, index) => {
        value = value.replace(`{${index.toFixed()}}`, param);
    });

    return value;
}

export function getTranslatedDuration(duration: number): string {
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / 1000 / 60) % 60);
    const hours = Math.floor((duration / 1000 / 60 / 60) % 24);

    const parts: string[] = [];

    if (hours !== 0) {
        parts.push(
            getTranslation(
                ['time.hours.short', hours === 1 ? 'one' : 'other'],
                hours.toFixed(),
            ),
        );
    }

    if (minutes !== 0) {
        parts.push(
            getTranslation(
                ['time.minutes.short', minutes === 1 ? 'one' : 'other'],
                minutes.toFixed(),
            ),
        );
    }

    // Only show seconds if hours are less than 1
    if (hours === 0 && seconds !== 0) {
        parts.push(
            getTranslation(
                ['time.seconds.short', seconds === 1 ? 'one' : 'other'],
                seconds.toFixed(),
            ),
        );
    }

    return parts.join(' ');
}
