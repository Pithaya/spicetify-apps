import React from 'react';
import { SpotifyIcon } from '../ui/SpotifyIcon/SpotifyIcon';
import { TabBarItem } from './TabBarItem';
import type { TopBarItem } from './top-bar-item';

export type Props = {
    items: TopBarItem[];
    activeItem: TopBarItem;
    onItemClicked: (item: TopBarItem) => void;
    windowSize: number;
    moreMenu?: JSX.Element;
};

export function TabBar(props: Readonly<Props>): JSX.Element {
    return (
        <nav
            style={{ pointerEvents: 'all' }}
            className="tw:flex tw:justify-between"
        >
            <ul className="tw:flex tw:items-center">
                {props.items.map((item) => (
                    <TabBarItem
                        key={item.key}
                        item={item}
                        active={props.activeItem.key === item.key}
                        onItemClicked={props.onItemClicked}
                    />
                ))}
            </ul>
            {props.moreMenu && (
                <Spicetify.ReactComponent.ContextMenu
                    trigger="click"
                    action="toggle"
                    menu={props.moreMenu}
                >
                    <Spicetify.ReactComponent.ButtonTertiary
                        aria-label="Menu"
                        aria-haspopup="menu"
                        iconOnly={() => <SpotifyIcon icon="more" />}
                        style={{ paddingTop: '0', paddingBottom: '0' }}
                    ></Spicetify.ReactComponent.ButtonTertiary>
                </Spicetify.ReactComponent.ContextMenu>
            )}
        </nav>
    );
}
