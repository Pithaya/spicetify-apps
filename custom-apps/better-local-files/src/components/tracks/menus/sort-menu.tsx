import styles from '../../../css/app.module.scss';
import React from 'react';
import { CaretDown } from '../../shared/icons/caret-down';
import {
    SelectedSortOption,
    SortOption,
} from 'custom-apps/better-local-files/src/models/sort-option';
import { CaretUp } from '../../shared/icons/caret-up';

export interface IProps {
    sortOptions: SortOption[];
    selectedSortOption: SelectedSortOption;
    setSelectedSortOption: (o: SortOption) => void;
}

export function SortMenu(props: IProps) {
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

            {props.sortOptions.map((o) => (
                <Spicetify.ReactComponent.MenuItem
                    key={o.key}
                    onClick={() => props.setSelectedSortOption(o)}
                >
                    <span>{o.label}</span>
                    {props.selectedSortOption.key === o.key &&
                        (props.selectedSortOption.order === 'asc' ? (
                            <CaretUp
                                className={`${styles['sort-menu-caret']}`}
                            />
                        ) : (
                            <CaretDown
                                className={`${styles['sort-menu-caret']}`}
                            />
                        ))}
                </Spicetify.ReactComponent.MenuItem>
            ))}
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
                <span>{props.selectedSortOption.label}</span>
                <CaretDown />
            </button>
        </Spicetify.ReactComponent.ContextMenu>
    );
}
