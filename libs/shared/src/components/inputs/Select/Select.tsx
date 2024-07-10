import React from 'react';
import styles from './Select.module.scss';
import { ChevronDown } from 'lucide-react';

type Item = {
    id: string;
    label: string;
};

export type Props = {
    selectLabel: string;
    items: Item[];
    onItemClicked: (item: Item) => void;
    selectedItemId: string | null;
};

function SelectMenu(
    props: Readonly<Pick<Props, 'items' | 'onItemClicked'>>,
): JSX.Element {
    return (
        <Spicetify.ReactComponent.Menu className={'main-contextMenu-menu'}>
            {props.items.map((item) => (
                <Spicetify.ReactComponent.MenuItem
                    key={item.id}
                    onClick={() => {
                        props.onItemClicked(item);
                    }}
                >
                    <span>{item.label}</span>
                </Spicetify.ReactComponent.MenuItem>
            ))}
        </Spicetify.ReactComponent.Menu>
    );
}

export function Select(props: Readonly<Props>): JSX.Element {
    return (
        <Spicetify.ReactComponent.ContextMenu
            trigger="click"
            action="toggle"
            placement="bottom"
            menu={
                <SelectMenu
                    items={props.items}
                    onItemClicked={props.onItemClicked}
                />
            }
        >
            <div
                className={`main-dropDown-dropDown ${styles['dropdown']} nodrag`}
            >
                <span className={styles['dropdown-label']}>
                    {props.selectedItemId !== null
                        ? props.items.find((i) => i.id === props.selectedItemId)
                              ?.label
                        : props.selectLabel}
                </span>
                <ChevronDown size={14} />
            </div>
        </Spicetify.ReactComponent.ContextMenu>
    );
}
