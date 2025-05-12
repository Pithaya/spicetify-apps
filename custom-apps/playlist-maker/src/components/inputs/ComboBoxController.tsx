import React from 'react';
import {
    type Control,
    Controller,
    type FieldPath,
    type FieldValues,
} from 'react-hook-form';
import {
    Combobox,
    type Props as ComboboxProps,
    type TComboboxItem,
} from './ComboBox';

type Props<T extends FieldValues, TItem extends TComboboxItem> = {
    control: Control<T>;
    name: FieldPath<T>;
} & ComboboxProps<TItem>;

export function ComboBoxController<
    T extends FieldValues,
    TItem extends TComboboxItem,
>(props: Readonly<Props<T, TItem>>): JSX.Element {
    return (
        <Controller
            name={props.name}
            control={props.control}
            render={({ field: { onChange }, formState: { disabled } }) => (
                <Combobox
                    items={props.items}
                    itemRenderer={props.itemRenderer}
                    itemToString={props.itemToString}
                    label={props.label}
                    placeholder={props.placeholder}
                    selectedItem={props.selectedItem}
                    onItemSelected={(item) => {
                        props.onItemSelected(item);
                        onChange(item.id);
                    }}
                    inputValue={props.inputValue}
                    onInputChanged={props.onInputChanged}
                    onClear={props.onClear}
                    onBlur={props.onBlur}
                    disabled={disabled}
                />
            )}
        />
    );
}
