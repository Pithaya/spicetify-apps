import { type Item, Select } from '@shared/components/inputs/Select/Select';
import React from 'react';
import {
    type Control,
    Controller,
    type FieldPath,
    type FieldValues,
} from 'react-hook-form';

type Props<T extends FieldValues, TItemValue extends string> = {
    control: Control<T>;
    name: FieldPath<T>;
    label: string;
    items: Item<TItemValue>[];
    onChange?: (value: TItemValue | undefined) => void;
};

export function SelectController<
    T extends FieldValues,
    TItemValue extends string,
>(props: Readonly<Props<T, TItemValue>>): JSX.Element {
    return (
        <Controller
            name={props.name}
            control={props.control}
            render={({ field: { onChange, onBlur, value, name, ref } }) => (
                <Select
                    selectLabel={props.label}
                    selectedValue={value}
                    items={props.items}
                    onItemClicked={(item) => {
                        onChange(item.value);

                        if (props.onChange) {
                            props.onChange(item.value);
                        }
                    }}
                    onBlur={onBlur}
                    name={name}
                    ref={ref}
                />
            )}
        />
    );
}
