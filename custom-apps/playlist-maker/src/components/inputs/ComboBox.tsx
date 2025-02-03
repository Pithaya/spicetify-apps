import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { useCombobox } from 'downshift';
import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

// Used to force open the combobox
const forceOpen = true;

// TODO: remove logs

type TItem = {
    id: string;
};

export type ItemRendererProps<T extends TItem> = {
    item: T;
    index: number;
    isHighlighted: boolean;
    isSelected: boolean;
};

export type Props<T extends TItem> = {
    fetchItems: (input: string) => Promise<T[]>;
    itemToString: (item: T) => string;
    itemRenderer: (props: ItemRendererProps<T>) => JSX.Element;
    label: string;
    placeholder: string;
};

export function Combobox<T extends TItem>(
    props: Readonly<Props<T>>,
): JSX.Element {
    const { fetchItems } = props;

    const [items, setItems] = useState<T[]>([]);
    const [selectedItem, setSelectedItem] = useState<T | null>(null);
    const [debouncedInput, setDebouncedInput] = useState<string>('');

    const debouncedInputCallback = useDebouncedCallback((value) => {
        setDebouncedInput(value);
        console.log('debounced input:', value);
    }, 200);

    useEffect(() => {
        const fetchItemsAsync = async (): Promise<void> => {
            console.log('fetching items with input ', debouncedInput);
            const items = await fetchItems(debouncedInput);
            console.log('fetched items:', items);
            setItems(items);
        };

        void fetchItemsAsync();
    }, [debouncedInput, fetchItems]);

    const {
        isOpen,
        getToggleButtonProps,
        getLabelProps,
        getMenuProps,
        getInputProps,
        highlightedIndex,
        getItemProps,
    } = useCombobox({
        onInputValueChange({ inputValue }) {
            debouncedInputCallback(inputValue);
        },
        items,
        itemToString(item) {
            return item ? props.itemToString(item) : '';
        },
        selectedItem,
        onSelectedItemChange: ({ selectedItem: newSelectedItem }) => {
            setSelectedItem(newSelectedItem);
        },
    });

    return (
        <div className="relative">
            <div className="flex flex-col gap-1">
                <label
                    htmlFor="combobox-search"
                    className="w-fit"
                    {...getLabelProps()}
                >
                    <TextComponent elementType="small">
                        {props.label}
                    </TextComponent>
                </label>
                <div className="bg-spice-tab-active flex gap-0.5 rounded-sm !pe-1">
                    <input
                        placeholder={props.placeholder}
                        className="w-full truncate !p-1.5"
                        id="combobox-search"
                        {...getInputProps()}
                    />
                    <button
                        aria-label="toggle menu"
                        className="!px-2"
                        type="button"
                        {...getToggleButtonProps()}
                    >
                        {isOpen ? (
                            <ChevronUp size={16} />
                        ) : (
                            <ChevronDown size={16} />
                        )}
                    </button>
                </div>
            </div>
            <ul
                className={`bg-spice-highlight-elevated absolute z-10 !mt-1 max-h-80 w-full overflow-scroll rounded-sm !p-0 ${
                    !isOpen && !forceOpen ? 'hidden' : ''
                }`}
                {...getMenuProps()}
            >
                {(isOpen || forceOpen) &&
                    items.length > 0 &&
                    items.map((item, index) => (
                        <li
                            className={Spicetify.classnames(
                                highlightedIndex === index
                                    ? 'bg-spice-highlight-elevated-hover'
                                    : '',
                                'flex flex-col',
                            )}
                            key={item.id}
                            {...getItemProps({ item, index })}
                        >
                            {props.itemRenderer({
                                item,
                                index,
                                isHighlighted: highlightedIndex === index,
                                isSelected: selectedItem?.id === item.id,
                            })}
                        </li>
                    ))}
                {(isOpen || forceOpen) && items.length === 0 && (
                    <div className="flex items-center justify-center !p-2">
                        <TextComponent elementType="span" fontSize="small">
                            No results
                        </TextComponent>
                    </div>
                )}
            </ul>
        </div>
    );
}
