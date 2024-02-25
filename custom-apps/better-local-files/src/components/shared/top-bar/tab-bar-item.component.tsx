import React from 'react';
import styles from '../../../css/app.module.scss';
import type { TopBarItem } from '../../../models/top-bar-item';
import { TextComponent } from '../text/text';

export type Props = {
    item: TopBarItem;
    active: boolean;
    onItemClicked: (item: TopBarItem) => void;
};

export function TabBarItem(props: Readonly<Props>): JSX.Element {
    return (
        <li
            data-tab={props.item.key}
            onClick={() => {
                props.onItemClicked(props.item);
            }}
        >
            <button
                className={props.active ? styles['active'] : ''}
                draggable="false"
            >
                <TextComponent variant="mestoBold">
                    {props.item.label}
                </TextComponent>
            </button>
        </li>
    );
}
