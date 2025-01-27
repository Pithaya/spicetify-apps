import { useCallback, useState } from 'react';

export function useMap<TKey, TValue>(
    values: [TKey, TValue][],
): [ReadonlyMap<TKey, TValue>, (values: [TKey, TValue][]) => void] {
    const [map, setMap] = useState<Map<TKey, TValue>>(
        new Map<TKey, TValue>(values),
    );

    const setMapValues = useCallback(
        (values: [TKey, TValue][]): void => {
            setMap(new Map<TKey, TValue>(values));
        },
        [setMap],
    );

    return [map, setMapValues];
}
