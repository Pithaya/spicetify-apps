import React from 'react';

type Props = {
    inputId: string;
    value: boolean;
    onChange: (value: boolean) => void;
};

export function CheckBoxComponent(props: Readonly<Props>): JSX.Element {
    return (
        <label className="x-toggle-wrapper">
            <input
                id={props.inputId}
                className="x-toggle-input"
                type="checkbox"
                checked={props.value}
                onChange={(e) => {
                    props.onChange(!props.value);
                }}
            />
            <span className="x-toggle-indicatorWrapper">
                <span className="x-toggle-indicator"></span>
            </span>
        </label>
    );
}
