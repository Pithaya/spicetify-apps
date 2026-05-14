import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import React from 'react';
import type { TopBarItem } from './top-bar-item';

export type Props = {
    item: TopBarItem;
    active: boolean;
    onItemClicked: (item: TopBarItem) => void;
};

export function TabBarItem(props: Readonly<Props>): JSX.Element {
    return (
        <li data-tab={props.item.key}>
            <button
                className={Spicetify.classnames(
                    'tw:h-full tw:cursor-pointer tw:rounded tw:border-none tw:px-4 tw:py-2 tw:text-(--spice-text)',
                    props.active
                        ? 'tw:bg-(--spice-tab-active)'
                        : 'tw:bg-transparent',
                )}
                draggable="false"
                onClick={() => {
                    props.onItemClicked(props.item);
                }}
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
