// Adapted from the marketplace: spicetify/spicetify-marketplace/src/components/TabBar.tsx

import React, { useState, useEffect } from 'react';
import type { TopBarItem } from '../../../models/top-bar-item';
import { TabBar } from './tab-bar.component';

export type Props = {
    items: TopBarItem[];
    activeItem: TopBarItem;
    onItemClicked: (item: TopBarItem) => void;
};

export function TopBarContent(props: Readonly<Props>): JSX.Element {
    const resizeHost = document.querySelector(
        '.main-view-container__scroll-node',
    );
    if (!resizeHost) {
        throw new Error('Could not find resize host');
    }

    const [windowSize, setWindowSize] = useState(resizeHost.clientWidth);

    const resizeHandler = (): void => {
        setWindowSize(resizeHost.clientWidth);
    };

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
