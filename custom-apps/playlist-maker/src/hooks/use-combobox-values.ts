import { useCallback, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import type { TComboboxItem } from '../components/inputs/ComboBox';

type UseComboboxValuesReturn<T extends TComboboxItem> = {
    selectedItem: T | null;
    onItemSelected: (item: T | null) => void;
    items: T[];
    inputValue: string;
    onInputChanged: (value: string) => void;
    resetSelection: () => void;
    syncInputWithSelectedItem: () => void;
    onSelectedIdChanged: (selectedId: string) => Promise<void>;
};

export function useComboboxValues<T extends TComboboxItem>(
    fetchItem: (id: string) => Promise<T | null>,
    fetchItems: (input: string) => Promise<T[]>,
    itemToString: (item: T) => string,
    updateNodeField: (item: T | null) => void,
): UseComboboxValuesReturn<T> {
    const [selectedItem, setSelectedItem] = useState<T | null>(null);
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

    // On item selection, update the input and form value
    const onItemSelected = (item: T | null): void => {
        updateNodeField(item);

        // Item and input will be updated in syncComboboxValues
        // but do it now to update interface faster
        setSelectedItem(item);
        setInputValue(item ? itemToString(item) : '');
    };

    // On clear : reset the combobox values and update the form
    const resetSelection = (): void => {
        updateNodeField(null);

        // Item and input will be updated in syncComboboxValues
        // but do it now to update interface faster
        setSelectedItem(null);
        setInputValue('');
    };

    // Sync input with selected item
    // Used on blur to cancel an incomplete search
    const syncInputWithSelectedItem = (): void => {
        setInputValue(selectedItem ? itemToString(selectedItem) : '');
    };

    // Sync combobox values
    const syncComboboxValues = useCallback(
        (item: T | null, input: string, items: T[]): void => {
            setSelectedItem(item);
            setInputValue(input);
            setItems(items);
        },
        [],
    );

    // When the selected id changes (init, load, item selection),
    // set the combobox selected item
    const onSelectedIdChanged = useCallback(
        async (selectedId: string): Promise<void> => {
            // First init, set to null (default)
            if (selectedId === '') {
                const items = await fetchItems('');
                syncComboboxValues(null, '', items);

                return;
            }

            const item = await fetchItem(selectedId);

            if (item === null) {
                syncComboboxValues(null, '', []);
            } else {
                syncComboboxValues(item, itemToString(item), [item]);
            }
        },
        [fetchItem, fetchItems, itemToString, syncComboboxValues],
    );

    return {
        selectedItem,
        onItemSelected,
        items,
        inputValue,
        onInputChanged,
        resetSelection,
        syncInputWithSelectedItem,
        onSelectedIdChanged,
    };
}
