import { getPlatform } from '@shared/utils';

export function getTranslation(keys: string[], ...params: any[]): string {
    const translations = getPlatform().Translations;

    let valueObject: any | string = translations;

    for (const key of keys) {
        valueObject = valueObject[key];
    }

    let value = valueObject as string;

    params.forEach((param, index) => {
        value = value.replace(`{${index}}`, params[index]);
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
                hours,
            ),
        );
    }

    if (minutes !== 0) {
        parts.push(
            getTranslation(
                ['time.minutes.short', minutes === 1 ? 'one' : 'other'],
                minutes,
            ),
        );
    }

    // Only show seconds if hours are less than 1
    if (hours === 0 && seconds !== 0) {
        parts.push(
            getTranslation(
                ['time.seconds.short', seconds === 1 ? 'one' : 'other'],
                seconds,
            ),
        );
    }

    return parts.join(' ');
}
