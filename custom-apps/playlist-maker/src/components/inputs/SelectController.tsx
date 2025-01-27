import { type Item, Select } from '@shared/components/inputs/Select/Select';
import React from 'react';
import {
    type Control,
    Controller,
    type FieldPath,
    type FieldValues,
} from 'react-hook-form';

type Props<T extends FieldValues> = {
    control: Control<T>;
    name: FieldPath<T>;
    label: string;
    items: Item[];
};

export function SelectController<T extends FieldValues>(
    props: Readonly<Props<T>>,
): JSX.Element {
    return (
        <Controller
            name={props.name}
            control={props.control}
            render={({ field: { onChange, value } }) => (
                <Select
                    selectLabel={props.label}
                    selectedValue={value ?? undefined}
                    items={props.items}
                    onItemClicked={(item) => {
                        onChange(item.value);
                    }}
                />
            )}
        />
    );
}
