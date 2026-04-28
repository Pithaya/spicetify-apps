import { SpotifyIcon } from '@shared/components/ui/SpotifyIcon/SpotifyIcon';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { useOutsideClick } from '@shared/hooks/use-outside-click';
import { uniqueBy } from '@shared/utils/array-utils';
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
        <div className="tw:flex tw:flex-col">
            <div className="tw:flex tw:items-center tw:px-2 tw:py-1">
                <span>Select all</span>
            </div>
            <hr className="tw:border-t-1" />
        </div>
    );
}

function UnselectAllItemRenderer(): JSX.Element {
    return (
        <div className="tw:flex tw:flex-col">
            <div className="tw:flex tw:items-center tw:justify-between tw:gap-2 tw:px-2 tw:py-1">
                <span>Unselect all</span>
                <span className="tw:shrink-0">
                    <SpotifyIcon
                        semanticColor="textBrightAccent"
                        icon="check"
                        iconSize={12}
                    />
                </span>
            </div>
            <hr className="tw:border-t-1" />
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

    const allDisplayedItemsSelected = props.items.every((item) =>
        selectedItems.includes(item),
    );
    const menuItems = [
        allDisplayedItemsSelected ? unselectAllItem : selectAllItem,
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
                            // Add all displayed items to the selected items
                            props.onItemsSelected(
                                uniqueBy(
                                    [...props.selectedItems, ...props.items],
                                    (item) => item.id,
                                ),
                            );
                            return;
                        }

                        if (newSelectedItem === props.unselectAllItem) {
                            // Remove all displayed items from the selected items
                            props.onItemsSelected([
                                ...props.selectedItems.filter(
                                    (item) => !props.items.includes(item),
                                ),
                            ]);
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

    const menuRef = useOutsideClick<HTMLUListElement>(closeMenu);

    return (
        <>
            <div className="tw:relative">
                <div className="tw:flex tw:flex-col tw:gap-1">
                    <label
                        htmlFor="multiselect-search"
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
                            className="tw:w-full tw:truncate tw:p-1.5"
                            id="multiselect-search"
                            onBlur={() => {
                                props.onBlur();
                            }}
                            disabled={props.disabled}
                        />
                        <button
                            aria-label="toggle menu"
                            className="tw:px-2"
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
                    ref={menuRef}
                    {...getMenuProps()}
                >
                    {(isOpen || forceOpen) && props.items.length > 0 && (
                        <>
                            {menuItems.map((item, index) => (
                                <li
                                    className={Spicetify.classnames(
                                        highlightedIndex === index
                                            ? 'tw:bg-spice-highlight-elevated-hover'
                                            : '',
                                        'tw:flex tw:flex-col',
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
                        <div className="tw:flex tw:items-center tw:justify-center tw:p-2">
                            <TextComponent elementType="span" fontSize="small">
                                No results
                            </TextComponent>
                        </div>
                    )}
                </ul>
            </div>
            <div className="tw:flex tw:max-h-48 tw:flex-wrap tw:gap-1 tw:overflow-y-scroll">
                {selectedItems.map((selectedItemForRender, index) => (
                    <span
                        className="tw:hover:bg-spice-tab-active tw:bg-spice-highlight-elevated tw:flex tw:max-w-72 tw:items-center tw:gap-2 tw:rounded-full tw:px-2.5"
                        key={`selected-item-${index.toFixed()}`}
                        {...getSelectedItemProps({
                            selectedItem: selectedItemForRender,
                            index,
                        })}
                        tabIndex={-1}
                    >
                        <span className="tw:truncate">
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
