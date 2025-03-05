/**
 * Returns the input value as a string if it is not empty, null or undefined.
 * Otherwise return undefined.
 * We return undefined instead of null so that empty form values will not be persisted in storage.
 * @param value The input value.
 * @returns A string, or undefined.
 */
export function setValueAsOptionalString(
    value: string | null | undefined,
): string | undefined {
    if (!value) {
        return undefined;
    }

    return value;
}

/**
 * Returns the input value as a number if it is not empty, null or undefined.
 * Otherwise return undefined.
 * We return undefined instead of null so that empty form values will not be persisted in storage.
 * @param value The input value.
 * @returns A number, or undefined.
 */
export function setValueAsOptionalNumber(
    value: string | null | undefined,
): number | undefined {
    if (!value) {
        return undefined;
    }

    return Number(value);
}
