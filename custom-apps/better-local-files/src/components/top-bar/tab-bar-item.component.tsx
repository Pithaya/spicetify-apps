import React from 'react';
import styles from '../../css/app.module.scss';
import { TopBarItem } from '../../models/top-bar-item';

export interface IProps {
    item: TopBarItem;
    active: boolean;
    onItemClicked: (item: TopBarItem) => void;
}

export function TabBarItem(props: IProps) {
    return (
        <li
            data-tab={props.item.key}
            onClick={() => props.onItemClicked(props.item)}
        >
            <button
                role="navigation"
                aria-current="page"
                className={props.active ? styles['active'] : ''}
                draggable="false"
            >
                <span className="main-type-mestoBold">{props.item.label}</span>
            </button>
        </li>
    );
}
