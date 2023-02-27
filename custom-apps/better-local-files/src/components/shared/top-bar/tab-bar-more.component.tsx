import React from 'react';
import styles from '../../../css/app.module.scss';
import { TopBarItem } from '../../../models/top-bar-item';

export interface IProps {
    items: TopBarItem[];
    activeItem: TopBarItem;
    onClick: (item: TopBarItem) => void;
}

export function TabBarMore(props: IProps) {
    const menu = (
        <Spicetify.ReactComponent.Menu>
            {props.items
                .filter((i) => i !== props.activeItem)
                .map((item) => (
                    <Spicetify.ReactComponent.MenuItem
                        onClick={() => props.onClick(item)}
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
