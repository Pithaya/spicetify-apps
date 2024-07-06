import React from 'react';
import styles from './NumberInput.module.scss';

export type Props = {
    value?: number;
    placeholder: string;
    onChange: (value: number) => void;
};

export function NumberInput(props: Readonly<Props>): JSX.Element {
    return (
        <input
            className={styles['number-input']}
            type="number"
            placeholder={props.placeholder}
            value={props.value}
            onChange={(e) => {
                props.onChange(e.target.valueAsNumber);
            }}
        />
    );
}
