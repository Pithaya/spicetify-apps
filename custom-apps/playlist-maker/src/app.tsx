import React, { useEffect, useState } from 'react';
import whatsNew from 'spcr-whats-new';
import { version } from '../package.json';
import { CHANGE_NOTES } from './change-notes';

// Can't use `import 'reactflow/dist/style.css';` because of postcss2 issue
// eslint-disable-next-line sonarjs/no-internal-api-use
import '../../../node_modules/reactflow/dist/style.css';
import './css/overrides.scss';
import './css/reactflow.scss';
import './css/tailwind.css';

import type { TopBarItem } from '@shared/components/top-bar/top-bar-item';
import { TopBarContent } from '@shared/components/top-bar/TopBarContent';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { getPlatform } from '@shared/utils/spicetify-utils';
import { useShallow } from 'zustand/react/shallow';
import { EditorPage } from './components/editor/EditorPage';
import { ResultPage } from './components/result/ResultPage';
import { EDITOR_ROUTE, RESULT_ROUTE } from './constants';
import useAppStore from './stores/store';

type ResultTopBarItemData = {
    resultCount: number;
};

const editorTopBarItem: TopBarItem = {
    key: 'Editor',
    href: EDITOR_ROUTE,
    label: 'Editor',
};

const resultTopBarItem: TopBarItem = {
    key: 'Result',
    href: RESULT_ROUTE,
    label: 'Result',
    render: (item: TopBarItem) => {
        const data = item.data as ResultTopBarItemData | undefined;
        const showCount =
            data?.resultCount !== undefined && data.resultCount > 0;

        return (
            <div className="flex items-center justify-center gap-2">
                <TextComponent variant="mestoBold">{item.label}</TextComponent>
                {showCount && (
                    <div className="flex items-center rounded-full bg-(--spice-main-elevated) px-2 py-0.5">
                        <TextComponent variant="mestoBold" fontSize="x-small">
                            {data.resultCount}
                        </TextComponent>
                    </div>
                )}
            </div>
        );
    },
};

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

    const { result } = useAppStore(
        useShallow((state) => ({
            result: state.result,
        })),
    );

    const [topBarItems, setTopBarItems] = useState([
        editorTopBarItem,
        resultTopBarItem,
    ]);

    useEffect(() => {
        setTopBarItems([
            editorTopBarItem,
            {
                ...resultTopBarItem,
                data: { resultCount: result.length } as ResultTopBarItemData,
            },
        ]);
    }, [result]);

    const history = getPlatform().History;
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
