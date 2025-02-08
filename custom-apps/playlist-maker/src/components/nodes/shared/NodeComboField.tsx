import React, { type PropsWithChildren } from 'react';
import { type FieldError } from 'react-hook-form';
import { InputError } from '../../inputs/InputError';

export type Props = PropsWithChildren<{
    error: FieldError | undefined;
}>;

export function NodeComboField(props: Readonly<Props>): JSX.Element {
    return (
        <div>
            {props.children}
            <InputError error={props.error} />
        </div>
    );
}
