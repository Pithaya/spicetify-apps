import { DateTime } from 'luxon';
import React from 'react';
import {
    type Control,
    Controller,
    type FieldPath,
    type FieldValues,
    type Path,
    type PathValue,
} from 'react-hook-form';

type Props<T extends FieldValues> = {
    control: Control<T>;
    name: FieldPath<T>;
    placeholder: string;
    onChange: (value: Date | undefined) => void;
};

export function DateController<T extends FieldValues>(
    props: Readonly<Props<T>>,
): JSX.Element {
    const getDateValue = (value: PathValue<T, Path<T>>) => {
        if (value === undefined || value === null) {
            return '';
        }

        return DateTime.fromJSDate(value as Date).toISODate() ?? '';
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
                    type="date"
                    placeholder={props.placeholder}
                    onChange={(e) => {
                        const value = e.target.valueAsDate;

                        // Update value in form for validation
                        // and in parent to update the state
                        onChange(value);

                        props.onChange(value ?? undefined);
                    }}
                    onBlur={onBlur}
                    value={getDateValue(value)}
                    name={name}
                    disabled={disabled}
                    ref={ref}
                />
            )}
        />
    );
}
