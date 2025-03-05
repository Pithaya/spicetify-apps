export function getEntries<TKey, TValue>(
    map: Map<TKey, TValue> | ReadonlyMap<TKey, TValue>,
): { key: TKey; value: TValue }[] {
    return Array.from(map.entries()).map(([key, value]) => ({ key, value }));
}
