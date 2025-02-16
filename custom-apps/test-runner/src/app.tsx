import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { getPlatform } from '@shared/utils/spicetify-utils';
import React from 'react';
import { tests } from './tests/playlist-maker/playlist-node/playlist-node.tests';

import './css/tailwind.css';

function App(): JSX.Element {
    const historyApi = getPlatform().History;

    function setup(): void {
        historyApi.push('/playlist-maker');
    }

    async function runTest(): Promise<void> {
        for (const test of tests) {
            try {
                setup();
                await test.test();
                console.log(`Test "${test.name}" succeeded`);
            } catch (e) {
                console.error(`Test "${test.name}" failed`, e);
            }
        }
    }

    return (
        <div className="absolute inset-0">
            <div className="flex h-[64px] w-full items-center justify-start !p-4">
                <TextComponent elementType="h1" fontSize="xxx-large">
                    Tests
                </TextComponent>
            </div>

            <TextComponent elementType="h2" fontSize="xx-large">
                Playlist Maker
            </TextComponent>
            <div>
                <Spicetify.ReactComponent.ButtonPrimary onClick={runTest}>
                    Run test
                </Spicetify.ReactComponent.ButtonPrimary>
            </div>
        </div>
    );
}

export default App;
