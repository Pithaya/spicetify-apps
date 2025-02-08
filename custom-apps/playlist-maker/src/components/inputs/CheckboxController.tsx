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
    onChange: (value: boolean) => void;
};

export function CheckboxController<T extends FieldValues>(
    props: Readonly<Props<T>>,
): JSX.Element {
    return (
        <Controller
            control={props.control}
            name={props.name}
            render={({ field: { onChange, onBlur, value, name, ref } }) => (
                <input
                    type="checkbox"
                    onChange={(e) => {
                        const value = e.target.checked;

                        // Update value in form for validation
                        // and in parent to update the state
                        onChange(value);
                        props.onChange(value);
                    }}
                    onBlur={onBlur}
                    value={value}
                    name={name}
                    ref={ref}
                />
            )}
        />
    );
}
