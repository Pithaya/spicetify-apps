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
        <div className="tw:relative">
            <div className="tw:flex tw:flex-col tw:gap-1">
                <label
                    htmlFor="combobox-search"
                    className="tw:w-fit"
                    {...getLabelProps()}
                >
                    <TextComponent elementType="small">
                        {props.label}
                    </TextComponent>
                </label>
                <div className="tw:bg-spice-tab-active tw:flex tw:gap-0.5 tw:rounded-sm tw:pe-1">
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
                        className="tw:w-full tw:truncate tw:p-1.5 tw:bg-spice-tab-active tw:border-none tw:rounded-sm tw:text-spice-text"
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
                        className="tw:px-2 tw:bg-transparent tw:border-none"
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
                className={`tw:bg-spice-highlight-elevated tw:absolute tw:z-10 tw:mt-1 tw:max-h-80 tw:w-full tw:overflow-scroll tw:rounded-sm tw:p-0 ${
                    !isOpen && !forceOpen ? 'tw:hidden' : ''
                }`}
                {...getMenuProps()}
            >
                {(isOpen || forceOpen) && loading && (
                    <div className="tw:flex tw:items-center tw:justify-center tw:p-2">
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
                                    ? 'tw:bg-spice-highlight-elevated-hover'
                                    : '',
                                'tw:flex tw:flex-col',
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
                    <div className="tw:flex tw:items-center tw:justify-center tw:p-2">
                        <TextComponent elementType="span" fontSize="small">
                            No results
                        </TextComponent>
                    </div>
                )}
            </ul>
        </div>
    );
}
