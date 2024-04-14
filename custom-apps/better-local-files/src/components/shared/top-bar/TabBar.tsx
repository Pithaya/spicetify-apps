import React, { useState, useEffect } from 'react';
import type { TopBarItem } from '../../../models/top-bar-item';
import { TabBarItem } from './TabBarItem';
import { TabBarMore } from './TabBarMore';
import styles from './TabBar.module.scss';

export type Props = {
    items: TopBarItem[];
    activeItem: TopBarItem;
    onItemClicked: (item: TopBarItem) => void;
    windowSize: number;
};

export function TabBar(props: Readonly<Props>): JSX.Element {
    const tabBarRef = React.useRef<HTMLUListElement | null>(null);
    const [childrenSizes, setChildrenSizes] = useState<number[]>([]);
    const [availableSpace, setAvailableSpace] = useState<number>(0);
    const [droplistItems, setDroplistItems] = useState<number[]>([]);
    const [moreButtonSize, setMoreButtonSize] = useState<number>(0);

    useEffect(() => {
        if (!tabBarRef.current) return;
        setAvailableSpace(tabBarRef.current.clientWidth);
    }, [props.windowSize]);

    useEffect(() => {
        if (!tabBarRef.current) return;

        const children = Array.from(tabBarRef.current.children).filter(
            (e) => e.id !== 'more-button',
        );
        const tabbarItemSizes = children.map((child) => child.clientWidth);

        setChildrenSizes(tabbarItemSizes);
    }, [props.items]);

    useEffect(() => {
        if (!tabBarRef.current) return;

        const totalSize = childrenSizes.reduce((a, b) => a + b, 0);

        // Can we render everything?
        if (totalSize <= availableSpace) {
            setDroplistItems([]);
            return;
        }

        // The `More` button can be set to _any_ of the children. So we
        // reserve space for the largest item instead of always taking
        // the last item.
        // Also take into account the dropdown's padding to show the entire
        // text content.
        const padding = 32;
        const viewMoreButtonSize = Math.max(...childrenSizes) + padding;

        // Figure out how many children we can render while also showing
        // the More button
        const itemsToHide = [] as number[];
        let stopWidth = viewMoreButtonSize;

        childrenSizes.forEach((childWidth, i) => {
            if (availableSpace >= stopWidth + childWidth) {
                stopWidth += childWidth;
            } else {
                itemsToHide.push(i);
            }
        });

        setDroplistItems(itemsToHide);
        setMoreButtonSize(viewMoreButtonSize);
    }, [availableSpace, childrenSizes]);

    return (
        <nav className={styles['tabBar']}>
            <ul ref={tabBarRef}>
                {props.items
                    .filter((_, id) => !droplistItems.includes(id))
                    .map((item) => (
                        <TabBarItem
                            key={item.key}
                            item={item}
                            active={props.activeItem.key === item.key}
                            onItemClicked={props.onItemClicked}
                        />
                    ))}
                {droplistItems.length || childrenSizes.length === 0 ? (
                    <TabBarMore
                        items={props.items.filter(
                            (item, id) =>
                                droplistItems.includes(id) ||
                                item.key === props.activeItem.key,
                        )}
                        activeItem={props.activeItem}
                        onClick={props.onItemClicked}
                        size={moreButtonSize}
                    />
                ) : null}
            </ul>
        </nav>
    );
}
