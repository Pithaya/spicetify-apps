// Adapted from the marketplace: spicetify/spicetify-marketplace/src/components/TabBar.tsx

import React, { useState, useEffect } from 'react';
import { TopBarItem } from '../../../models/top-bar-item';
import { TabBar } from './tab-bar.component';

export interface IProps {
    items: TopBarItem[];
    activeItem: TopBarItem;
    onItemClicked: (item: TopBarItem) => void;
}

export function TopBarContent(props: IProps) {
    const resizeHost = document.querySelector(
        '.Root__main-view .os-resize-observer-host'
    );
    if (!resizeHost) return null;

    const [windowSize, setWindowSize] = useState(resizeHost.clientWidth);

    const resizeHandler = () => setWindowSize(resizeHost.clientWidth);

    useEffect(() => {
        const observer = new ResizeObserver(resizeHandler);
        observer.observe(resizeHost);
        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <TabBar
            windowSize={windowSize}
            items={props.items}
            activeItem={props.activeItem}
            onItemClicked={props.onItemClicked}
        />
    );
}
