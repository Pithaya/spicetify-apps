import { useCallback, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import type { TComboboxItem } from '../components/inputs/ComboBox';

type UseComboboxValuesReturn<T extends TComboboxItem> = {
    syncComboboxValues: (item: T | null, input: string, items: T[]) => void;
    selectedItem: T | null;
    onItemSelected: (item: T | null) => void;
    items: T[];
    inputValue: string;
    onInputChanged: (value: string) => void;
    resetSelection: () => void;
};

export function useComboboxValues<T extends TComboboxItem>(
    fetchItems: (input: string) => Promise<T[]>,
    itemToString: (item: T) => string,
    updateNodeField: (item: T | null) => void,
): UseComboboxValuesReturn<T> {
    const [selectedItem, setSelectedItem] = useState<T | null>(null);
    const [inputValue, setInputValue] = useState<string>('');
    const [items, setItems] = useState<T[]>([]);

    const debouncedInputCallback = useDebouncedCallback((value) => {
        console.log('NODE - debounced input:', value);

        fetchItems(value)
            .then((items) => {
                console.log('NODE - fetched items:', items);
                setItems(items);
            })
            .catch((error) => {
                console.error('NODE - fetch error:', error);
            });
    }, 200);

    // On type: refresh items on debounce
    const onInputChanged = (value: string): void => {
        console.log('NODE - input changed:', value);
        setInputValue(value);
        debouncedInputCallback(value);
    };

    // On item selection, update the input and form value
    const onItemSelected = (item: T | null): void => {
        console.log('NODE - item selected:', item?.id);
        updateNodeField(item);
        setSelectedItem(item);
        setInputValue(item ? itemToString(item) : '');
    };

    // On clear : reset the combobox values and update the form
    const resetSelection = (): void => {
        updateNodeField(null);
        setSelectedItem(null);
        setInputValue('');
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

    return {
        syncComboboxValues,
        selectedItem,
        onItemSelected,
        items,
        inputValue,
        onInputChanged,
        resetSelection,
    };
}
