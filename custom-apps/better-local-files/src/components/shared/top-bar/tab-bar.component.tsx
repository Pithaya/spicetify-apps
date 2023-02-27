import React, { useState, useEffect } from 'react';
import { TopBarItem } from '../../../models/top-bar-item';
import { TabBarItem } from './tab-bar-item.component';
import { TabBarMore } from './tab-bar-more.component';
import styles from '../../../css/app.module.scss';

export interface IProps {
    items: TopBarItem[];
    activeItem: TopBarItem;
    onItemClicked: (item: TopBarItem) => void;
    windowSize: number;
}

export function TabBar(props: IProps) {
    const tabBarRef = React.useRef<HTMLUListElement | null>(null);
    const [childrenSizes, setChildrenSizes] = useState([] as number[]);
    const [availableSpace, setAvailableSpace] = useState(0);
    const [droplistItem, setDroplistItems] = useState([] as number[]);

    useEffect(() => {
        if (!tabBarRef.current) return;
        setAvailableSpace(tabBarRef.current.clientWidth);
    }, [props.windowSize]);

    useEffect(() => {
        if (!tabBarRef.current) return;

        const children = Array.from(tabBarRef.current.children);
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
        const viewMoreButtonSize = Math.max(...childrenSizes);

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
    }, [availableSpace, childrenSizes]);

    return (
        <nav className={styles['tabBar']}>
            <ul ref={tabBarRef}>
                {props.items
                    .filter((_, id) => !droplistItem.includes(id))
                    .map((item) => (
                        <TabBarItem
                            key={item.key}
                            item={item}
                            active={props.activeItem.key === item.key}
                            onItemClicked={props.onItemClicked}
                        />
                    ))}
                {droplistItem.length || childrenSizes.length === 0 ? (
                    <TabBarMore
                        items={droplistItem.map((i) => props.items[i])}
                        activeItem={props.activeItem}
                        onClick={props.onItemClicked}
                    />
                ) : null}
            </ul>
        </nav>
    );
}
