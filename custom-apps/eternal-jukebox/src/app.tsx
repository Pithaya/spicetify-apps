import styles from 'css/app.module.scss';
import { useSubscription } from 'observable-hooks';
import React, { useEffect, useState } from 'react';
import whatsNew from 'spcr-whats-new';
import { version } from '../package.json';
import { CHANGE_NOTES } from './change-notes';
import { Home } from './components/Home';
import { SettingsButton } from './components/settings/SettingsButton';
import type { JukeboxSongState } from './models/jukebox-song-state';

import './css/index.css';

function App(): JSX.Element {
    const [songState, setSongState] = useState<JukeboxSongState | null>(null);

    useSubscription(window.jukebox.songState$, setSongState);

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

    let appContent;

    if (window.jukebox.isEnabled) {
        if (songState !== null) {
            appContent = <Home />;
        } else {
            appContent = (
                <div className={styles['elements-container']}>
                    <SettingsButton />
                    <div>
                        <h1>Loading...</h1>
                    </div>
                </div>
            );
        }
    } else {
        appContent = (
            <div className={styles['elements-container']}>
                <SettingsButton />
                <div>
                    <h1>Jukebox not enabled.</h1>
                </div>
            </div>
        );
    }

    return (
        <div id="eternal-jukebox" className={styles['full-size-container']}>
            {appContent}
        </div>
    );
}

export default App;
