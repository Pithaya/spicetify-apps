import styles from './css/app.module.scss';
import React, { useEffect, useState } from 'react';
import { LocalFilesApi, LocalTrack } from '@shared';
import { Header } from './components/header.component';
import { ActionBar } from './components/action-bar.component';
import { TrackList } from './components/track-list/track-list';

function App() {
    const api = Spicetify.Platform.LocalFilesAPI as LocalFilesApi;
    const [tracks, setTracks] = useState<LocalTrack[]>([]);

    useEffect(() => {
        async function getTracks() {
            const tracks = await api.getTracks();
            setTracks(tracks.slice(0, 40));
        }

        getTracks();
    }, []);

    return (
        <>
            <div className={styles.container}>
                <Header tracksCount={tracks.length} />
                <ActionBar tracks={tracks} />
                <TrackList tracks={tracks} />
            </div>
        </>
    );
}

export default App;
