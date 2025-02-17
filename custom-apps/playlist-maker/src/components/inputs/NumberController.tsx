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
    placeholder: string;
    onChange: (value: number | undefined) => void;
    required?: boolean;
};

export function NumberController<T extends FieldValues>(
    props: Readonly<Props<T>>,
): JSX.Element {
    const { required = false } = props;

    const toOptionalInput = (value: number | undefined): string => {
        return value === undefined ? '' : value.toString();
    };

    const fromOptionalInput = (value: string): number | undefined => {
        return value === '' ? undefined : Number(value);
    };

    return (
        <Controller
            control={props.control}
            name={props.name}
            render={({
                field: { onChange, onBlur, value, name, ref },
                fieldState: { invalid },
                formState: { disabled },
            }) => (
                <input
                    className={Spicetify.classnames(
                        'bg-spice-tab-active w-full rounded-sm !p-1 !px-2.5',
                        invalid
                            ? 'border-spice-error border-1 border-solid'
                            : 'border-0 border-none',
                    )}
                    type="number"
                    placeholder={props.placeholder}
                    onChange={(e) => {
                        const value = required
                            ? e.target.valueAsNumber
                            : fromOptionalInput(e.target.value);

                        // Update value in form for validation
                        // and in parent to update the state
                        onChange(value);
                        props.onChange(value);
                    }}
                    onBlur={onBlur}
                    value={required ? value : toOptionalInput(value)}
                    name={name}
                    disabled={disabled}
                    ref={ref}
                />
            )}
        />
    );
}
