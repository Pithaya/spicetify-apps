import React from 'react';

type Item = {
    value: string;
    label: string;
};

export type Props = {
    selectLabel: string;
    items: Item[];
    onItemClicked: (item: Item) => void;
    selectedValue: string | null;
    disabled?: boolean;
};

export function Select(props: Readonly<Props>): JSX.Element {
    return (
        <select
            className="main-dropDown-dropDown"
            disabled={props.disabled}
            value={props.selectedValue ?? undefined}
            onChange={(event) => {
                const item = props.items.find(
                    (i) => i.value === event.target.value,
                );

                if (item) {
                    props.onItemClicked(item);
                }
            }}
        >
            {props.selectedValue === null && (
                <option value={undefined} disabled selected={true}>
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
