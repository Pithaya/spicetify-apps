import { useCombobox } from 'downshift';
import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';

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
    fetchItems: (input: string) => T[];
    itemToString: (item: T) => string;
    itemRenderer: (props: ItemRendererProps<T>) => JSX.Element;
};
export function Combobox<T extends TItem>(
    props: Readonly<Props<T>>,
): JSX.Element {
    const { fetchItems } = props;

    const [items, setItems] = React.useState<T[]>([]);
    const [selectedItem, setSelectedItem] = React.useState<T | null>(null);
    const [debouncedInput, setDebouncedInput] = React.useState<string>('');

    const debouncedInputCallback = useDebouncedCallback((value) => {
        setDebouncedInput(value);
    }, 200);

    useEffect(() => {
        console.log('fetching items');
        setItems(fetchItems(debouncedInput));
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
                    Choose your favorite book:
                </label>
                <div className="flex gap-0.5 bg-spice-tab-active rounded-sm !pe-1">
                    <input
                        placeholder="Best book ever"
                        className="w-full p-1.5"
                        id="combobox-search"
                        {...getInputProps()}
                    />
                    <button
                        aria-label="toggle menu"
                        className="px-2"
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
                className={`absolute w-full mt-1 max-h-80 overflow-scroll p-0 z-10 bg-spice-highlight-elevated rounded-sm ${
                    !(isOpen && items.length) && 'hidden'
                }`}
                {...getMenuProps()}
            >
                {isOpen &&
                    items.map((item, index) => (
                        <li
                            className={Spicetify.classnames(
                                highlightedIndex === index
                                    ? 'bg-spice-highlight-elevated-hover'
                                    : '',
                                selectedItem === item ? 'font-bold' : '',
                                'py-2 px-3 shadow-sm flex flex-col',
                            )}
                            key={item.id}
                            {...getItemProps({ item, index })}
                        >
                            {props.itemRenderer({
                                item,
                                index,
                                isHighlighted: highlightedIndex === index,
                                isSelected: selectedItem === item,
                            })}
                        </li>
                    ))}
            </ul>
        </div>
    );
}
