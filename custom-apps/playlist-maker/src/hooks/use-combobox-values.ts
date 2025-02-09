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

    const debouncedInputCallback = useDebouncedCallback((value) => {
        console.log('COMBO - debounced input:', value);

        fetchItems(value)
            .then((items) => {
                console.log('COMBO - debounce fetched items:', items);
                setItems(items);
            })
            .catch((error) => {
                console.error('COMBO - debounce fetched items error:', error);
            });
    }, 200);

    // On type: refresh items on debounce
    const onInputChanged = (value: string): void => {
        console.log('COMBO - input changed:', value);

        setInputValue(value);
        debouncedInputCallback(value);
    };

    // On item selection, update the input and form value
    const onItemSelected = (item: T | null): void => {
        console.log('COMBO - item selected:', item?.id);

        updateNodeField(item);
        setSelectedItem(item);
        setInputValue(item ? itemToString(item) : '');
    };

    // On clear : reset the combobox values and update the form
    const resetSelection = (): void => {
        console.log('COMBO - reset selection');

        updateNodeField(null);
        setSelectedItem(null);
        setInputValue('');
    };

    // Sync combobox values
    const syncComboboxValues = useCallback(
        (item: T | null, input: string, items: T[]): void => {
            console.log('COMBO - sync combo values');

            setSelectedItem(item);
            setInputValue(input);
            setItems(items);
        },
        [],
    );

    // Sync input with selected item
    // Used on blur to cancel an incomplete search
    const syncInputWithSelectedItem = (): void => {
        console.log('COMBO - sync input with selected item');

        setInputValue(selectedItem ? itemToString(selectedItem) : '');
    };

    // When the selected id changes (init, load, item selection),
    // set the combobox selected item
    const onSelectedIdChanged = useCallback(
        async (selectedId: string): Promise<void> => {
            console.log('COMBO - on selected id change');

            // First init, set to null (default)
            if (selectedId === '') {
                console.log('COMBO - selected id change - empty id');
                const items = await fetchItems('');
                syncComboboxValues(null, '', items);

                return;
            }

            console.log('COMBO - selected id change - new item', selectedId);
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
