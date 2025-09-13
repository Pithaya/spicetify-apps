import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { useCombobox } from 'downshift';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import React from 'react';

export type TComboboxItem = {
    id: string;
};

export type ItemRendererProps<T extends TComboboxItem> = {
    item: T;
    index: number;
    isHighlighted: boolean;
    isSelected: boolean;
};

export type Props<T extends TComboboxItem> = {
    selectedItem: T | null;
    onItemSelected: (item: T) => void;
    items: T[];
    itemToString: (item: T) => string;
    itemRenderer: (props: ItemRendererProps<T>) => JSX.Element;
    label: string;
    placeholder: string;
    inputValue: string;
    onInputChanged: (inputValue: string) => void;
    onClear: () => void;
    onBlur: () => void;
    disabled?: boolean;
    // Used to force open the combobox for debug purposes
    forceOpen?: boolean;
    loading: boolean;
};

export function Combobox<T extends TComboboxItem>(
    props: Readonly<Props<T>>,
): JSX.Element {
    const {
        selectedItem,
        items,
        inputValue,
        forceOpen = false,
        loading,
    } = props;

    const {
        isOpen,
        getToggleButtonProps,
        getLabelProps,
        getMenuProps,
        getInputProps,
        highlightedIndex,
        getItemProps,
    } = useCombobox({
        items,
        itemToString(item) {
            return item ? props.itemToString(item) : '';
        },
        selectedItem,
        onSelectedItemChange: ({ selectedItem: newSelectedItem }) => {
            props.onItemSelected(newSelectedItem);
        },
        inputValue,
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
                        {...getInputProps({
                            onChange: (
                                e: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                                const value = e.target.value;

                                // Only trigger event on type, not on item selection
                                if (
                                    selectedItem &&
                                    value === props.itemToString(selectedItem)
                                ) {
                                    return;
                                }

                                props.onInputChanged(value);
                            },
                        })}
                        placeholder={props.placeholder}
                        className="w-full truncate !p-1.5"
                        id="combobox-search"
                        onBlur={() => {
                            props.onBlur();
                        }}
                        disabled={props.disabled}
                    />
                    {selectedItem !== null && (
                        <Spicetify.ReactComponent.TooltipWrapper label="Clear selection">
                            <button
                                aria-label="clear selection"
                                type="button"
                                disabled={props.disabled}
                            >
                                <X size={16} onClick={props.onClear} />
                            </button>
                        </Spicetify.ReactComponent.TooltipWrapper>
                    )}
                    <button
                        aria-label="toggle menu"
                        className="!px-2"
                        type="button"
                        {...getToggleButtonProps()}
                        disabled={props.disabled}
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
                {(isOpen || forceOpen) && loading && (
                    <div className="flex items-center justify-center !p-2">
                        <TextComponent elementType="span" fontSize="small">
                            Loading...
                        </TextComponent>
                    </div>
                )}
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
                {(isOpen || forceOpen) && !loading && items.length === 0 && (
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
