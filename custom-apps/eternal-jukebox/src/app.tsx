import React, { useEffect } from 'react';
import whatsNew from 'spcr-whats-new';
import { version } from '../package.json';
import { CHANGE_NOTES } from './change-notes';
import { Home } from './components/Home';

import './css/tailwind.css';

function App(): JSX.Element {
    async function init(): Promise<void> {
        await whatsNew('eternal-jukebox', version, {
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

    return (
        <div
            id="eternal-jukebox"
            className="absolute top-0 right-0 bottom-0 left-0 pt-[64px]"
        >
            <Home />
        </div>
    );
}

export default App;
