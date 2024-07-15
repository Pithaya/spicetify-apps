export function stringValueSetter(value: string): string | undefined {
    if (value === '') {
        return undefined;
    }

    return value.trim();
}

export function numberValueSetter(value: string): number | undefined {
    if (value === '') {
        return undefined;
    }

    return Number(value);
}
