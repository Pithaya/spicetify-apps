import React, { type ForwardedRef, forwardRef } from 'react';
import { type UseFormRegister } from 'react-hook-form';
import styles from './NumberInput.module.scss';

export type Props = {
    placeholder: string;
} & ReturnType<UseFormRegister<any>>;

export const NumberInput = forwardRef(function NumberInput(
    props: Readonly<Props>,
    ref: ForwardedRef<HTMLInputElement>,
): JSX.Element {
    return (
        <input
            className={Spicetify.classnames(styles['number-input'])}
            type="number"
            placeholder={props.placeholder}
            ref={ref}
            name={props.name}
            onChange={props.onChange}
            onBlur={props.onBlur}
        />
    );
});
