import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import React from 'react';
import type { Test } from './models/test';
import { tests as extendedCopyTests } from './tests/extended-copy/extension.tests';
import { tests as playlistNodeTests } from './tests/playlist-maker/playlist-node/playlist-node.tests';

import './css/tailwind.css';

type Suite = {
    name: string;
    tests: Test[];
};

const SUITES: Suite[] = [
    { name: 'Playlist Maker — playlist-node', tests: playlistNodeTests },
    { name: 'Extended Copy', tests: extendedCopyTests },
];

async function runSuite(suite: Suite): Promise<void> {
    console.log(`Running suite "${suite.name}"`);
    for (const t of suite.tests) {
        try {
            await t.test();
            console.log(`Test "${t.name}" succeeded`);
        } catch (e) {
            console.error(`Test "${t.name}" failed`, e);
        }
    }
}

function App(): JSX.Element {
    return (
        <div className="absolute inset-0">
            <div className="flex h-[64px] w-full items-center justify-start !p-4">
                <TextComponent elementType="h1" fontSize="xxx-large">
                    Tests
                </TextComponent>
            </div>

            <div className="flex flex-col gap-4 !p-4">
                {SUITES.map((suite) => (
                    <div key={suite.name} className="flex flex-col gap-2">
                        <TextComponent elementType="h2" fontSize="xx-large">
                            {suite.name}
                        </TextComponent>
                        <div>
                            <Spicetify.ReactComponent.ButtonPrimary
                                onClick={() => {
                                    void runSuite(suite);
                                }}
                            >
                                Run suite
                            </Spicetify.ReactComponent.ButtonPrimary>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
