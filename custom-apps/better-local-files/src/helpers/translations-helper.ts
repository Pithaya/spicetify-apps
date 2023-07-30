import { Translations } from '@shared/platform';

export function getTranslation(keys: string[], ...params: any[]): string {
    const translations = Spicetify.Platform.Translations as Translations;

    let valueObject: any | string = translations;

    for (const key of keys) {
        valueObject = valueObject[key];
    }

    let value = valueObject as string;

    for (const paramIndex in params) {
        value = value.replace(`{${paramIndex}}`, params[paramIndex]);
    }

    return value;
}

export function getTranslatedDuration(duration: number): string {
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / 1000 / 60) % 60);
    const hours = Math.floor((duration / 1000 / 60 / 60) % 24);

    let parts = [];

    if (hours !== 0) {
        parts.push(
            getTranslation(
                ['time.hours.short', hours === 1 ? 'one' : 'other'],
                hours
            )
        );
    }

    if (minutes !== 0) {
        parts.push(
            getTranslation(
                ['time.minutes.short', minutes === 1 ? 'one' : 'other'],
                minutes
            )
        );
    }

    // Only show seconds if hours are less than 1
    if (hours === 0 && seconds !== 0) {
        parts.push(
            getTranslation(
                ['time.seconds.short', seconds === 1 ? 'one' : 'other'],
                seconds
            )
        );
    }

    return parts.join(' ');
}
