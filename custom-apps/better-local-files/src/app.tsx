import styles from './css/app.module.scss';
import React, { useEffect, useState } from 'react';
import { LocalFilesApi, LocalTrack } from '@shared';
import { Header } from './components/header.component';
import { ActionBar } from './components/action-bar.component';
import { TrackList } from './components/track-list/track-list';
import { History } from '@shared';
import { CUSTOM_APP_PATH, Routes } from './constants/constants';
import { TopBarItem } from './models/top-bar-item';
import { TopBarContent } from './components/top-bar/top-bar-content.component';
import ReactDOM from 'react-dom';

function App() {
    const api = Spicetify.Platform.LocalFilesAPI as LocalFilesApi;
    const history = Spicetify.Platform.History as History;
    const location = history.location;

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
            href: Routes.tracks,
            label: 'Tracks',
        },
        {
            key: 'Albums',
            href: Routes.albums,
            label: 'Albums',
        },
        {
            key: 'Artists',
            href: Routes.artists,
            label: 'Artists',
        },
    ];

    let currentPage = <></>;

    switch (location.pathname) {
        case Routes.tracks:
            currentPage = (
                <>
                    <Header tracksCount={tracks.length} />
                    <ActionBar tracks={tracks} />
                    <TrackList tracks={tracks} />
                </>
            );
            break;
        case Routes.album:
            currentPage = <h1>Album</h1>;
            break;
        case Routes.albums:
            currentPage = <h1>Albums</h1>;
            break;
        case Routes.artist:
            currentPage = <h1>artist</h1>;
            break;
        case Routes.artists:
            currentPage = <h1>artists</h1>;
            break;
        default:
            history.replace(Routes.tracks);
    }

    function navigateTo(href: string) {
        history.push(href);
    }

    const topBarContainer = document.querySelector(
        '.main-topBar-topbarContentWrapper'
    );

    return (
        <>
            <div className={`${styles.container} ${styles.padded}`}>
                {currentPage}
            </div>
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
