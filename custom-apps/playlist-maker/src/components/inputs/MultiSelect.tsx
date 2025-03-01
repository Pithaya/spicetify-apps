import { SpotifyIcon } from '@shared/components/ui/SpotifyIcon/SpotifyIcon';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { useCombobox, useMultipleSelection } from 'downshift';
import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { useCallback } from 'react';

export type TMultiSelectItem = {
    id: string;
};

export type ItemRendererProps<T extends TMultiSelectItem> = {
    item: T;
    index: number;
    isHighlighted: boolean;
    isSelected: boolean;
};

export type Props<T extends TMultiSelectItem> = {
    selectedItems: T[];
    onItemsSelected: (items: T[]) => void;
    items: T[];
    itemToString: (item: T) => string;
    itemRenderer: (props: ItemRendererProps<T>) => JSX.Element;
    unselectAllItem: T;
    selectAllItem: T;
    label: string;
    placeholder: string;
    inputValue: string;
    onInputChanged: (inputValue: string) => void;
    onBlur: () => void;
    disabled?: boolean;
    // Used to force open the combobox for debug purposes
    forceOpen?: boolean;
};

function SelectAllItemRenderer(): JSX.Element {
    return (
        <div className="flex flex-col">
            <div className="flex items-center !px-2 !py-1">
                <span>Select all</span>
            </div>
            <hr className="border-t-1" />
        </div>
    );
}

function UnselectAllItemRenderer(): JSX.Element {
    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between gap-2 !px-2 !py-1">
                <span>Unselect all</span>
                <span className="shrink-0">
                    <SpotifyIcon
                        semanticColor="textBrightAccent"
                        icon="check"
                        iconSize={12}
                    />
                </span>
            </div>
            <hr className="border-t-1" />
        </div>
    );
}

export function MultiSelect<T extends TMultiSelectItem>(
    props: Readonly<Props<T>>,
): JSX.Element {
    const {
        selectedItems,
        onItemsSelected,
        inputValue,
        forceOpen = false,
        selectAllItem,
        unselectAllItem,
        itemRenderer,
    } = props;

    const menuItems = [
        selectedItems.length === props.items.length
            ? unselectAllItem
            : selectAllItem,
        ...props.items,
    ];

    const {
        isOpen,
        getToggleButtonProps,
        getLabelProps,
        getMenuProps,
        getInputProps,
        highlightedIndex,
        getItemProps,
        closeMenu,
    } = useCombobox({
        items: menuItems,
        itemToString(item) {
            return item ? props.itemToString(item) : '';
        },
        selectedItem: null,
        inputValue,
        stateReducer(state, actionAndChanges) {
            const { changes, type } = actionAndChanges;

            /*
            if (
                type !== useCombobox.stateChangeTypes.ItemMouseMove &&
                type !== useCombobox.stateChangeTypes.MenuMouseLeave &&
                type !==
                    useCombobox.stateChangeTypes
                        .ControlledPropUpdatedSelectedItem
            ) {
                debugger;
            }
*/

            switch (type) {
                case useCombobox.stateChangeTypes.InputKeyDownEnter:
                case useCombobox.stateChangeTypes.ItemClick:
                    return {
                        ...changes,
                        isOpen: true, // keep the menu open after selection.
                    };
                default:
                    return changes;
            }
        },
        onStateChange({
            inputValue: newInputValue,
            type,
            selectedItem: newSelectedItem,
        }) {
            switch (type) {
                case useCombobox.stateChangeTypes.InputKeyDownEnter:
                case useCombobox.stateChangeTypes.ItemClick:
                case useCombobox.stateChangeTypes.InputBlur:
                    if (newSelectedItem) {
                        if (newSelectedItem === props.selectAllItem) {
                            props.onItemsSelected(props.items);
                            return;
                        }

                        if (newSelectedItem === props.unselectAllItem) {
                            props.onItemsSelected([]);
                            return;
                        }

                        if (selectedItems.includes(newSelectedItem)) {
                            // Unselect item
                            props.onItemsSelected(
                                selectedItems.filter(
                                    (item) => item !== newSelectedItem,
                                ),
                            );
                        } else {
                            // Select item
                            props.onItemsSelected([
                                ...selectedItems,
                                newSelectedItem,
                            ]);
                        }
                    }
                    break;

                case useCombobox.stateChangeTypes.InputChange:
                    props.onInputChanged(newInputValue ?? '');

                    break;
                default:
                    break;
            }
        },
    });

    const { getSelectedItemProps, getDropdownProps, removeSelectedItem } =
        useMultipleSelection({
            selectedItems,
            onStateChange({ selectedItems: newSelectedItems, type }) {
                switch (type) {
                    case useMultipleSelection.stateChangeTypes
                        .SelectedItemKeyDownBackspace:
                    case useMultipleSelection.stateChangeTypes
                        .SelectedItemKeyDownDelete:
                    case useMultipleSelection.stateChangeTypes
                        .DropdownKeyDownBackspace:
                    case useMultipleSelection.stateChangeTypes
                        .FunctionRemoveSelectedItem:
                        onItemsSelected(newSelectedItems ?? []);
                        break;
                    default:
                        break;
                }
            },
        });

    const renderItem = useCallback(
        (item: T, index: number) => {
            if (item === selectAllItem) {
                return <SelectAllItemRenderer />;
            }

            if (item === unselectAllItem) {
                return <UnselectAllItemRenderer />;
            }

            return itemRenderer({
                item,
                index,
                isHighlighted: highlightedIndex === index,
                isSelected: selectedItems.includes(item),
            });
        },
        [
            highlightedIndex,
            selectedItems,
            selectAllItem,
            unselectAllItem,
            itemRenderer,
        ],
    );

    return (
        <>
            <div className="relative">
                <div className="flex flex-col gap-1">
                    <label
                        htmlFor="multiselect-search"
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
                                ...getDropdownProps({
                                    preventKeyAction: isOpen,
                                }),
                                onChange: (
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                    const value = e.target.value;
                                    props.onInputChanged(value);
                                },
                            })}
                            placeholder={props.placeholder}
                            className="w-full truncate !p-1.5"
                            id="multiselect-search"
                            onBlur={() => {
                                closeMenu();
                                props.onBlur();
                            }}
                            disabled={props.disabled}
                        />
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
                    {(isOpen || forceOpen) && props.items.length > 0 && (
                        <>
                            {menuItems.map((item, index) => (
                                <li
                                    className={Spicetify.classnames(
                                        highlightedIndex === index
                                            ? 'bg-spice-highlight-elevated-hover'
                                            : '',
                                        'flex flex-col',
                                    )}
                                    key={item.id}
                                    {...getItemProps({
                                        item,
                                        index,
                                    })}
                                >
                                    {renderItem(item, index)}
                                </li>
                            ))}
                        </>
                    )}
                    {(isOpen || forceOpen) && props.items.length === 0 && (
                        <div className="flex items-center justify-center !p-2">
                            <TextComponent elementType="span" fontSize="small">
                                No results
                            </TextComponent>
                        </div>
                    )}
                </ul>
            </div>
            <div className="flex flex-wrap gap-1">
                {selectedItems.map((selectedItemForRender, index) => (
                    <span
                        className="hover:bg-spice-tab-active bg-spice-highlight-elevated flex max-w-72 items-center gap-2 rounded-full !px-2.5"
                        key={`selected-item-${index.toFixed()}`}
                        {...getSelectedItemProps({
                            selectedItem: selectedItemForRender,
                            index,
                        })}
                        tabIndex={-1}
                    >
                        <span className="truncate">
                            {props.itemToString(selectedItemForRender)}
                        </span>
                        <button
                            aria-label="Remove item"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeSelectedItem(selectedItemForRender);
                            }}
                        >
                            <SpotifyIcon icon="x" iconSize={12} />
                        </button>
                    </span>
                ))}
            </div>
        </>
    );
}
