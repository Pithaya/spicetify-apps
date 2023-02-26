import styles from './css/app.module.scss';
import React, { useEffect, useState } from 'react';
import { LocalFilesApi, LocalTrack } from '@shared';
import { Header } from './components/header.component';
import { ActionBar } from './components/action-bar.component';
import { TrackList } from './components/track-list/track-list';
import { History } from '@shared';
import { CUSTOM_APP_PATH } from './constants/constants';

function App() {
    const api = Spicetify.Platform.LocalFilesAPI as LocalFilesApi;
    const [tracks, setTracks] = useState<LocalTrack[]>([]);

    useEffect(() => {
        async function getTracks() {
            const tracks = await api.getTracks();
            setTracks(tracks);
        }

        getTracks();
    }, []);

    const location = (Spicetify.Platform.History as History).location;

    if (location.pathname.startsWith(`${CUSTOM_APP_PATH}/albums`)) {
        return <h1>Albums</h1>;
    } else {
        return (
            <div className={styles.container}>
                <Header tracksCount={tracks.length} />
                <ActionBar tracks={tracks} />
                <TrackList tracks={tracks} />
            </div>
        );
    }
}

export default App;
