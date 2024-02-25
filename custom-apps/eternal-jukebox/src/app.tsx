import React, { useEffect, useState } from 'react';
import styles from 'css/app.module.scss';
import { HomeComponent } from './components/home.component';
import type { JukeboxSongState } from './models/jukebox-song-state';
import { SettingsButton } from './components/settings/settings-button';
import { version } from '../package.json';
import whatsNew from 'spcr-whats-new';
import { CHANGE_NOTES } from './change-notes';
import { useSubscription } from 'observable-hooks';

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

    if (window.jukebox.isEnabled) {
        if (songState !== null) {
            return (
                <div className={styles['full-size-container']}>
                    <HomeComponent />
                </div>
            );
        } else {
            return (
                <div className={styles['empty-container']}>
                    <div className={styles['elements-container']}>
                        <SettingsButton />
                        <div>
                            <h1>Loading...</h1>
                        </div>
                    </div>
                </div>
            );
        }
    } else {
        return (
            <div className={styles['empty-container']}>
                <div className={styles['elements-container']}>
                    <SettingsButton />
                    <div>
                        <h1>Jukebox not enabled.</h1>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
