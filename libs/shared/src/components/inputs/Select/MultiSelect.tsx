import { SpotifyIcon } from '@shared/components/ui/SpotifyIcon/SpotifyIcon';
import { ChevronDown } from 'lucide-react';
import React from 'react';
import styles from './MultiSelect.module.scss';
type Item = {
    value: string;
    label: string;
};

export type Props = {
    selectLabel: string;
    items: Item[];
    selectedValues: string[];
    onItemClicked: (value: string) => void;
};

function MultiSelectMenu(
    props: Readonly<Pick<Props, 'items' | 'onItemClicked' | 'selectedValues'>>,
): JSX.Element {
    return (
        <Spicetify.ReactComponent.Menu
            className={'main-contextMenu-menu' + ' ' + styles['menu']}
        >
            {props.items.map((item) => (
                <Spicetify.ReactComponent.MenuItem
                    key={item.value}
                    onClick={() => {
                        props.onItemClicked(item.value);
                    }}
                    leadingIcon={
                        props.selectedValues.includes(item.value) ? (
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
                    selectedValues={props.selectedValues}
                    onItemClicked={props.onItemClicked}
                />
            }
        >
            <div className={`main-dropDown-dropDown ${styles['dropdown']}`}>
                <span>
                    {props.selectedValues.length > 0
                        ? `${props.selectedValues.length.toFixed()} elements selected`
                        : props.selectLabel}
                </span>
                <ChevronDown size={14} />
            </div>
        </Spicetify.ReactComponent.ContextMenu>
    );
}
