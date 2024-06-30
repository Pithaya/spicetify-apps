import React from 'react';
import styles from './MultiSelect.module.scss';
import { SpotifyIcon } from '@shared/components/ui/SpotifyIcon/SpotifyIcon';
import { ChevronDown } from 'lucide-react';

export type Props = {
    selectLabel: string;
    items: { id: string; label: string }[];
    selectedItems: string[];
    onItemClicked: (id: string) => void;
};

function MultiSelectMenu(
    props: Readonly<Pick<Props, 'items' | 'onItemClicked' | 'selectedItems'>>,
): JSX.Element {
    return (
        <Spicetify.ReactComponent.Menu className={'main-contextMenu-menu'}>
            {props.items.map((item) => (
                <Spicetify.ReactComponent.MenuItem
                    key={item.id}
                    onClick={() => {
                        props.onItemClicked(item.id);
                    }}
                    leadingIcon={
                        props.selectedItems.includes(item.id) ? (
                            <SpotifyIcon
                                icon="check"
                                iconSize={12}
                                semanticColor="textBrightAccent"
                            />
                        ) : undefined
                    }
                >
                    <span>{item.label}</span>
                </Spicetify.ReactComponent.MenuItem>
            ))}
        </Spicetify.ReactComponent.Menu>
    );
}

export function MultiSelect(props: Readonly<Props>): JSX.Element {
    return (
        <Spicetify.ReactComponent.ContextMenu
            trigger="click"
            action="toggle"
            placement="bottom"
            menu={
                <MultiSelectMenu
                    items={props.items}
                    selectedItems={props.selectedItems}
                    onItemClicked={props.onItemClicked}
                />
            }
        >
            <div
                className={`main-dropDown-dropDown ${styles['dropdown']} nodrag`}
            >
                <span>{props.selectLabel}</span>
                <ChevronDown size={14} />
            </div>
        </Spicetify.ReactComponent.ContextMenu>
    );
}
