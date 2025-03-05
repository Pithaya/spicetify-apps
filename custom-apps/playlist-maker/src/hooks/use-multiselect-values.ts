import { useCallback, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { type TMultiSelectItem } from '../components/inputs/MultiSelect';

type UseMultiSelectValuesReturn<T extends TMultiSelectItem> = {
    selectedItems: T[];
    onItemsSelected: (items: T[]) => void;
    items: T[];
    inputValue: string;
    onInputChanged: (value: string) => void;
    onSelectedIdsChanged: (selectedIds: string[]) => Promise<void>;
};

export function useMultiSelectValues<T extends TMultiSelectItem>(
    fetchSelectedItems: (ids: string[]) => Promise<T[]>,
    fetchItems: (input: string) => Promise<T[]>,
    updateNodeField: (item: T[]) => void,
): UseMultiSelectValuesReturn<T> {
    const [selectedItems, setSelectedItems] = useState<T[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const [items, setItems] = useState<T[]>([]);

    const debouncedInputCallback = useDebouncedCallback((value: string) => {
        fetchItems(value)
            .then((items) => {
                setItems(items);
            })
            .catch((error: unknown) => {
                console.error('Failed to fetch items', error);
            });
    }, 200);

    // On type: refresh items on debounce
    const onInputChanged = (value: string): void => {
        setInputValue(value);
        debouncedInputCallback(value);
    };

    // On items selection, update the form value
    const onItemsSelected = (items: T[]): void => {
        updateNodeField(items);
    };

    // When the selected ids changes (init, load, items selection),
    // set the multiselect selected items
    const onSelectedIdsChanged = useCallback(
        async (selectedIds: string[]): Promise<void> => {
            const selectedIdsSet = new Set(selectedIds);
            const selectedItemsSet = new Set(
                selectedItems.map((item) => item.id),
            );

            // If the selected items are the same, do nothing
            if (
                selectedIdsSet.size === selectedItemsSet.size &&
                [...selectedIdsSet].every((id) => selectedItemsSet.has(id))
            ) {
                return;
            }

            // Fetch the selected items
            const newItems = await fetchSelectedItems(selectedIds);
            setSelectedItems(newItems);
        },
        [fetchSelectedItems, selectedItems, setSelectedItems],
    );

    useEffect(() => {
        const loadInitialItems = async (): Promise<void> => {
            const items = await fetchItems('');
            setItems(items);
        };

        void loadInitialItems();
    }, [fetchItems, setItems]);

    return {
        selectedItems,
        onItemsSelected,
        items,
        inputValue,
        onInputChanged,
        onSelectedIdsChanged,
    };
}
