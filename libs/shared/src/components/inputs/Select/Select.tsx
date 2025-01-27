import React from 'react';

export type Item = {
    value: string;
    label: string;
};

export type Props = {
    selectLabel: string;
    items: Item[];
    onItemClicked: (item: Item) => void;
    selectedValue: string | undefined;
    disabled?: boolean;
};

export function Select(props: Readonly<Props>): JSX.Element {
    return (
        <select
            className="main-dropDown-dropDown"
            disabled={props.disabled}
            value={props.selectedValue}
            onChange={(event) => {
                const item = props.items.find(
                    (i) => i.value === event.target.value,
                );

                if (item) {
                    props.onItemClicked(item);
                }
            }}
        >
            {!props.selectedValue && (
                <option value={props.selectedValue} disabled selected={true}>
                    {props.selectLabel}
                </option>
            )}

            {props.items.map((item) => (
                <option key={item.value} value={item.value}>
                    {item.label}
                </option>
            ))}
        </select>
    );
}
