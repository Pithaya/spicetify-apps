// Adapted from the marketplace: spicetify/spicetify-marketplace/src/components/TabBar.tsx

import React, { useEffect, useState } from 'react';
import { TabBar } from './TabBar';
import type { TopBarItem } from './top-bar-item';

export type Props = {
    items: TopBarItem[];
    activeItem: TopBarItem;
    onItemClicked: (item: TopBarItem) => void;
};

export function TopBarContent(props: Readonly<Props>): JSX.Element {
    const resizeHost = document.querySelector(
        '.Root__main-view .os-resize-observer-host, .Root__main-view .os-size-observer, .Root__main-view .main-view-container__scroll-node',
    );
    if (!resizeHost) {
        throw new Error('Could not find resize host');
    }

    const [windowSize, setWindowSize] = useState(resizeHost.clientWidth);

    useEffect(() => {
        const resizeHandler = (): void => {
            setWindowSize(resizeHost.clientWidth);
        };

        const observer = new ResizeObserver(resizeHandler);
        observer.observe(resizeHost);
        return () => {
            observer.disconnect();
        };
    }, [resizeHost]);

    return (
        <TabBar
            windowSize={windowSize}
            items={props.items}
            activeItem={props.activeItem}
            onItemClicked={props.onItemClicked}
        />
    );
}
