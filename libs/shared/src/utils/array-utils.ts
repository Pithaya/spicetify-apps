export function splitInChunks<T>(array: T[], chunkSize: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
    }

    return result;
}

export function isNotEmpty<T>(array: T[]): array is [T, ...T[]] {
    return array.length > 0;
}

export function uniqueBy<T>(
    items: T[],
    propertySelector: (item: T) => string,
): T[] {
    return items.filter((item, index, self) => {
        return (
            index ===
            self.findIndex(
                (t) => propertySelector(t) === propertySelector(item),
            )
        );
    });
}
