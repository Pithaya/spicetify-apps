export function wholeNumber(value: number | undefined): string | undefined {
    if (value === undefined) {
        return undefined;
    }

    if (!Number.isInteger(value)) {
        return 'The value must be a whole number';
    }

    return undefined;
}
