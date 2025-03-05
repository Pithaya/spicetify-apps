import { TopBarContent } from '@shared/components/top-bar/TopBarContent';
import { LoadingIcon } from '@shared/icons/Loading';
import { getPlatform } from '@shared/utils/spicetify-utils';
import { useObservableEagerState } from 'observable-hooks';
import React, { useEffect } from 'react';
import whatsNew from 'spcr-whats-new';
import { version } from '../package.json';
import { CHANGE_NOTES } from './change-notes';
import { AlbumPage } from './components/albums/pages/AlbumPage';
import { AlbumsPage } from './components/albums/pages/AlbumsPage';
import { ArtistPage } from './components/artists/pages/ArtistPage';
import { ArtistsPage } from './components/artists/pages/ArtistsPage';
import { TracksPage } from './components/tracks/pages/TracksPage';
import {
    ALBUM_ROUTE,
    ALBUMS_ROUTE,
    ARTIST_ROUTE,
    ARTISTS_ROUTE,
    topBarItems,
    TRACKS_ROUTE,
} from './constants/constants';
import styles from './css/app.module.scss';

function App(): JSX.Element {
    const isReady = useObservableEagerState(window.localTracksService.isReady$);

    const processedAlbums: number = useObservableEagerState(
        window.localTracksService.processedAlbums$,
    );

    const albumCount: number = useObservableEagerState(
        window.localTracksService.albumCount$,
    );

    async function init(): Promise<void> {
        await window.localTracksService.init();

        await whatsNew('better-local-files', version, {
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

    const history = getPlatform().History;
    const location = history.location;

    let currentPage = <></>;

    switch (location.pathname) {
        case TRACKS_ROUTE:
            currentPage = <TracksPage />;
            break;
        case ALBUM_ROUTE:
            currentPage = <AlbumPage />;
            break;
        case ALBUMS_ROUTE:
            currentPage = <AlbumsPage />;
            break;
        case ARTIST_ROUTE:
            currentPage = <ArtistPage />;
            break;
        case ARTISTS_ROUTE:
            currentPage = <ArtistsPage />;
            break;
        default:
            history.replace(TRACKS_ROUTE);
    }

    const topBarContainer = document.querySelector(
        '.main-topBar-topbarContentWrapper',
    );

    const showTracksProgress = albumCount === 0;
    const showAlbumsProgress = albumCount > 0;

    // TODO: localize progress labels ?

    return (
        <>
            <div className={styles['full-size-container']}>
                {isReady ? (
                    <div
                        className={`${styles['stretch-container']} ${styles.padded}`}
                    >
                        {currentPage}
                    </div>
                ) : (
                    <div
                        className={`${styles['center-container']} ${styles.padded}`}
                    >
                        <LoadingIcon />
                        {showTracksProgress && <p>Processing tracks...</p>}
                        {showAlbumsProgress && (
                            <p>
                                {`Processing album ${processedAlbums.toFixed()} of ${albumCount.toFixed()}...`}
                            </p>
                        )}
                    </div>
                )}
            </div>
            {topBarContainer !== null &&
                Spicetify.ReactDOM.createPortal(
                    <TopBarContent
                        onItemClicked={(item) => {
                            history.push(item.href);
                        }}
                        items={topBarItems}
                        activeItem={
                            topBarItems.find((i) =>
                                i.href.startsWith(location.pathname),
                            ) ?? topBarItems[0]
                        }
                    />,
                    topBarContainer,
                )}
        </>
    );
}

export default App;
