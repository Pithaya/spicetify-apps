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
            name={props.name}
            control={props.control}
            render={({
                field: { onChange, onBlur, value, name, ref },
                formState: { disabled },
            }) => (
                <input
                    type="checkbox"
                    onChange={(e) => {
                        const checked = e.target.checked;

                        // Update value in form for validation
                        // and in parent to update the state
                        onChange(checked);
                        props.onChange(checked);
                    }}
                    onBlur={onBlur}
                    checked={value}
                    name={name}
                    disabled={disabled}
                    ref={ref}
                    value={name}
                />
            )}
        />
    );
}
