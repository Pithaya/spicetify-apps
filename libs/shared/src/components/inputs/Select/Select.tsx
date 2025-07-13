import React, { type RefCallback } from 'react';

export type Item<T extends string> = {
    value: T;
    label: string;
};

export type Props<T extends string> = {
    selectLabel: string;
    items: Item<T>[];
    onItemClicked: (item: Item<T>) => void;
    selectedValue: string | undefined;
    disabled?: boolean;
    onBlur?: () => void;
    name: string;
    ref?: RefCallback<HTMLSelectElement>;
};

export function Select<T extends string>(
    props: Readonly<Props<T>>,
): JSX.Element {
    return (
        <select
            className="main-dropDown-dropDown bg-spice-tab-active"
            name={props.name}
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
            onBlur={props.onBlur}
            ref={props.ref}
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
