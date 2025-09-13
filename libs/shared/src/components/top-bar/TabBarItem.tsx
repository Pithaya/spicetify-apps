import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import React from 'react';
import styles from './TabBar.module.scss';
import type { TopBarItem } from './top-bar-item';

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
                {props.item.render ? (
                    props.item.render(props.item)
                ) : (
                    <TextComponent variant="mestoBold">
                        {props.item.label}
                    </TextComponent>
                )}
            </button>
        </li>
    );
}
