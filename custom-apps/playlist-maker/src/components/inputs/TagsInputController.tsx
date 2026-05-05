import React from 'react';
import {
    type Control,
    Controller,
    type FieldPath,
    type FieldValues,
} from 'react-hook-form';
import { TagsInput, type TagsInputProps } from './TagsInput';

type Props<T extends FieldValues> = {
    control: Control<T>;
    name: FieldPath<T>;
} & TagsInputProps;

export function TagsInputController<T extends FieldValues>(
    props: Readonly<Props<T>>,
): JSX.Element {
    return (
        <Controller
            control={props.control}
            name={props.name}
            render={({ field: { onChange }, formState: { disabled } }) => (
                <TagsInput
                    {...props}
                    onValuesChange={(values) => {
                        props.onValuesChange(values);
                        onChange(values);
                    }}
                    disabled={(props.disabled ?? false) || disabled}
                />
            )}
        />
    );
}
