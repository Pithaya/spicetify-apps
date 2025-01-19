import React from 'react';
import type { TopBarItem } from './top-bar-item';

export type Props = {
    items: TopBarItem[];
    activeItem: TopBarItem;
    onClick: (item: TopBarItem) => void;
    size: number;
};

export function TabBarMore(props: Readonly<Props>): JSX.Element {
    const style: React.CSSProperties = {
        width: `${props.size}px`,
    };

    return (
        <li id="more-button" style={style}>
            <select
                className="main-dropDown-dropDown"
                value={props.activeItem.key}
                disabled={false}
                onChange={(event) => {
                    const item = props.items.find(
                        (i) => i.key === event.target.value,
                    );
                    if (item) {
                        props.onClick(item);
                    }
                }}
            >
                {props.items.map((item) => {
                    return (
                        <option key={item.key} value={item.key}>
                            {item.label}
                        </option>
                    );
                })}
            </select>
        </li>
    );
}
