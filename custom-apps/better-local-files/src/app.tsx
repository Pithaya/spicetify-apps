import styles from './css/app.module.scss';
import React, { useEffect, useState } from 'react';
import { LocalFilesApi, LocalTrack } from '@shared';
import { Header } from './components/header.component';
import { ActionBar } from './components/action-bar.component';
import { TrackList } from './components/track-list/track-list';
import { History } from '@shared';
import { CUSTOM_APP_PATH } from './constants/constants';
import { TopBarItem } from './models/top-bar-item';
import { TopBarContent } from './components/top-bar/top-bar-content.component';
import ReactDOM from 'react-dom';

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

    const topBarItems: TopBarItem[] = [
        {
            key: 'Tracks',
            href: `${CUSTOM_APP_PATH}/tracks`,
            label: 'Tracks',
        },
        {
            key: 'Albums',
            href: `${CUSTOM_APP_PATH}/albums`,
            label: 'Albums',
        },
        {
            key: 'Artists',
            href: `${CUSTOM_APP_PATH}/artists`,
            label: 'Artists',
        },
    ];

    const history = Spicetify.Platform.History as History;
    const location = history.location;

    let currentPage = <></>;

    if (location.pathname.startsWith(`${CUSTOM_APP_PATH}/albums`)) {
        currentPage = <h1>Albums</h1>;
    } else {
        currentPage = (
            <>
                <Header tracksCount={tracks.length} />
                <ActionBar tracks={tracks} />
                <TrackList tracks={tracks} />
            </>
        );
    }

    function navigateTo(href: string) {
        history.push(href);
    }

    const topBarContainer = document.querySelector(
        '.main-topBar-topbarContentWrapper'
    );
    return (
        <>
            <div className={styles.container}>{currentPage}</div>
            {topBarContainer !== null &&
                ReactDOM.createPortal(
                    <TopBarContent
                        onItemClicked={(item) => navigateTo(item.href)}
                        items={topBarItems}
                        activeItem={topBarItems[0]}
                    />,
                    topBarContainer
                )}
        </>
    );
}

export default App;
