import React from 'react';
import {
    type Control,
    Controller,
    type FieldPath,
    type FieldValues,
} from 'react-hook-form';
import {
    MultiSelect,
    type Props as MultiSelectProps,
    type TMultiSelectItem,
} from './MultiSelect';

type Props<T extends FieldValues, TItem extends TMultiSelectItem> = {
    control: Control<T>;
    name: FieldPath<T>;
    disabled: boolean;
} & MultiSelectProps<TItem>;

export function MultiSelectController<
    T extends FieldValues,
    TItem extends TMultiSelectItem,
>(props: Readonly<Props<T, TItem>>): JSX.Element {
    return (
        <Controller
            name={props.name}
            control={props.control}
            render={({ field: { onChange }, formState: { disabled } }) => (
                <MultiSelect
                    selectedItems={props.selectedItems}
                    onItemsSelected={(items) => {
                        props.onItemsSelected(items);
                        onChange(items);
                    }}
                    inputValue={props.inputValue}
                    onInputChanged={props.onInputChanged}
                    placeholder={props.placeholder}
                    itemRenderer={props.itemRenderer}
                    itemToString={props.itemToString}
                    items={props.items}
                    label={props.label}
                    disabled={props.disabled || disabled}
                    onBlur={props.onBlur}
                    selectAllItem={props.selectAllItem}
                    unselectAllItem={props.unselectAllItem}
                />
            )}
        />
    );
}
