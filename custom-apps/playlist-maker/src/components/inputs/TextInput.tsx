import React from 'react';
import styles from './TextInput.module.scss';

export type Props = {
    value?: string;
    placeholder: string;
    onChange: (value: string) => void;
};

export function TextInput(props: Readonly<Props>): JSX.Element {
    return (
        <input
            className={styles['text-input']}
            type="text"
            placeholder={props.placeholder}
            value={props.value}
            onChange={(e) => {
                props.onChange(e.target.value);
            }}
        />
    );
}
