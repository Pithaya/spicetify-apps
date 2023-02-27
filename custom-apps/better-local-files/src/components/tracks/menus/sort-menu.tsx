import styles from '../../../css/app.module.scss';
import React from 'react';
import { CaretDown } from '../../shared/icons/caret-down';

export function SortMenu() {
    const menu = (
        <Spicetify.ReactComponent.Menu>
            <li>
                <span
                    className={`${styles['sort-menu-header']} main-contextMenu-menuHeading ellipsis-one-line`}
                    dir="auto"
                >
                    Trier par
                </span>
            </li>

            <Spicetify.ReactComponent.MenuItem>
                <span
                    dir="auto"
                    //className="ellipsis-one-line main-contextMenu-menuItemLabel"
                >
                    Date d'ajout
                </span>
            </Spicetify.ReactComponent.MenuItem>
        </Spicetify.ReactComponent.Menu>
    );

    return (
        <Spicetify.ReactComponent.ContextMenu
            trigger="click"
            action="toggle"
            menu={menu}
        >
            <button
                className="x-sortBox-sortDropdown"
                type="button"
                role="button"
                aria-expanded="false"
            >
                <span>Date d'ajout</span>
                <CaretDown />
            </button>
        </Spicetify.ReactComponent.ContextMenu>
    );
}
