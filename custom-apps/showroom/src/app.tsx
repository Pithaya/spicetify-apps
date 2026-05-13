import React from 'react';

import './css/overrides.scss';
import './css/tailwind.css';

import type { TopBarItem } from '@shared/components/top-bar/top-bar-item';
import { TopBarContent } from '@shared/components/top-bar/TopBarContent';
import { getPlatform } from '@shared/utils/spicetify-utils';
import { COLORS_ROUTE, TEXT_ROUTE } from './constants';
import { ColorsPage } from './pages/ColorsPage';
import { TextPage } from './pages/TextPage';

const topBarItems: TopBarItem[] = [
    {
        key: 'text',
        href: TEXT_ROUTE,
        label: 'Text',
    },
    {
        key: 'colors',
        href: COLORS_ROUTE,
        label: 'Colors',
    },
];

function App(): JSX.Element {
    const history = getPlatform().History;
    const location = history.location;

    let currentPage = <></>;

    switch (location.pathname) {
        case TEXT_ROUTE:
            currentPage = <TextPage />;
            break;
        case COLORS_ROUTE:
            currentPage = <ColorsPage />;
            break;
        default:
            history.replace(TEXT_ROUTE);
    }

    const topBarContainer = document.querySelector(
        '.main-topBar-topbarContentWrapper',
    );

    return (
        <>
            <div className="tw:px-4 tw:pt-[64px]">{currentPage}</div>
            {topBarContainer !== null &&
                Spicetify.ReactDOM.createPortal(
                    <TopBarContent
                        onItemClicked={(item) => {
                            history.push(item.href);
                        }}
                        items={topBarItems}
                        activeItem={
                            topBarItems.find((i) =>
                                i.href.startsWith(location.pathname),
                            ) ?? topBarItems[0]
                        }
                    />,
                    topBarContainer,
                )}
        </>
    );
}

export default App;
