import React, { useEffect, useState } from 'react';
import styles from 'css/app.module.scss';
import { HomeComponent } from './components/home.component';
import { JukeboxSongState } from './models/jukebox-song-state';
import { SettingsButton } from './components/settings/settings-button';

function App() {
    const [songState, setSongState] = useState<JukeboxSongState | null>(null);

    useEffect(() => {
        const subscription = window.jukebox.songState$.subscribe(
            (songState) => {
                setSongState(songState);
            }
        );
        return () => subscription.unsubscribe();
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
