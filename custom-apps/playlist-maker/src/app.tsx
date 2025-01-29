import React, { useEffect } from 'react';
import whatsNew from 'spcr-whats-new';
import { version } from '../package.json';
import { CHANGE_NOTES } from './change-notes';

// Can't use `import 'reactflow/dist/style.css';` because of postcss2 issue
import '../../../node_modules/reactflow/dist/style.css';
import './css/overrides.scss';
import './css/reactflow.scss';
import './css/tailwind.css';

import type { TopBarItem } from '@shared/components/top-bar/top-bar-item';
import { TopBarContent } from '@shared/components/top-bar/TopBarContent';
import type { History } from '@shared/platform/history';
import { getPlatformApiOrThrow } from '@shared/utils/spicetify-utils';
import { EditorPage } from './components/editor/EditorPage';
import { ResultPage } from './components/result/ResultPage';
import { EDITOR_ROUTE, RESULT_ROUTE } from './constants';

export const topBarItems: TopBarItem[] = [
    {
        key: 'Editor',
        href: EDITOR_ROUTE,
        label: 'Editor',
    },
    {
        key: 'Result',
        href: RESULT_ROUTE,
        label: 'Result',
    },
];

function App(): JSX.Element {
    async function init(): Promise<void> {
        await whatsNew('playlist-maker', version, {
            title: `New in v${version}`,
            content: (
                <p>
                    <ul>
                        {CHANGE_NOTES.map((value) => {
                            return <li key={value}>{value}</li>;
                        })}
                    </ul>
                </p>
            ),
            isLarge: true,
        });
    }

    useEffect(() => {
        void init();
    }, []);

    const history = getPlatformApiOrThrow<History>('History');
    const location = history.location;

    let currentPage = <></>;

    switch (location.pathname) {
        case EDITOR_ROUTE:
            currentPage = <EditorPage />;
            break;
        case RESULT_ROUTE:
            currentPage = <ResultPage />;
            break;
        default:
            history.replace(EDITOR_ROUTE);
    }

    const topBarContainer = document.querySelector(
        '.main-topBar-topbarContentWrapper',
    );

    return (
        <>
            {currentPage}
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
