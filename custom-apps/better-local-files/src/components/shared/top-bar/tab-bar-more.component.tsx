import React from 'react';
import styles from '../../../css/app.module.scss';
import type { TopBarItem } from '../../../models/top-bar-item';
import { SPOTIFY_MENU_CLASSES } from 'custom-apps/better-local-files/src/constants/constants';

export type Props = {
    items: TopBarItem[];
    activeItem: TopBarItem;
    onClick: (item: TopBarItem) => void;
};

export function TabBarMore(props: Readonly<Props>): JSX.Element {
    const menu = (
        <Spicetify.ReactComponent.Menu className={SPOTIFY_MENU_CLASSES}>
            {props.items
                .filter((i) => i !== props.activeItem)
                .map((item) => (
                    <Spicetify.ReactComponent.MenuItem
                        onClick={() => {
                            props.onClick(item);
                        }}
                        key={item.key}
                    >
                        <span>{item.label}</span>
                    </Spicetify.ReactComponent.MenuItem>
                ))}
        </Spicetify.ReactComponent.Menu>
    );

    return (
        <li>
            <Spicetify.ReactComponent.ContextMenu
                trigger="click"
                action="toggle"
                menu={menu}
            >
                <button
                    role="navigation"
                    aria-current="page"
                    className={styles['active']}
                    draggable="false"
                >
                    <span className="main-type-mestoBold">
                        {props.activeItem.label}
                    </span>
                </button>
            </Spicetify.ReactComponent.ContextMenu>
        </li>
    );
}
