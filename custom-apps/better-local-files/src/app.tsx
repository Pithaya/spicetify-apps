import styles from './css/app.module.scss';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { History } from '@shared/platform';
import { Routes, topBarItems } from './constants/constants';
import { TopBarContent } from './components/shared/top-bar/top-bar-content.component';
import { TracksPage } from './components/tracks/pages/tracks.page';
import { AlbumPage } from './components/albums/pages/album.page';
import { ArtistsPage } from './components/artists/pages/artists.page';
import { AlbumsPage } from './components/albums/pages/albums.page';
import { ArtistPage } from './components/artists/pages/artist.page';
import { LoadingIcon } from './components/shared/icons/loading';
import { useObservable } from './hooks/use-observable';
import whatsNew from 'spcr-whats-new';
import { version } from '../package.json';
import { CHANGE_NOTES } from './change-notes';
import ReactMarkdown from 'react-markdown';

// TODO: Add automatic version checks to the extensions and custom apps + powershell update scripts

function App() {
    const isReady = useObservable(
        window.localTracksService.isReady$,
        window.localTracksService.isReady
    );

    const processedAlbums = useObservable(
        window.localTracksService.processedAlbums$,
        0
    );
    const albumCount = useObservable(window.localTracksService.albumCount$, 0);

    useEffect(() => {
        window.localTracksService.init();

        const markdown = <ReactMarkdown children={CHANGE_NOTES} />;

        whatsNew('better-local-files', version, {
            title: `New in v${version}`,
            content: markdown,
            isLarge: true,
        });
    }, []);

    const history = Spicetify.Platform.History as History;
    const location = history.location;

    let currentPage = <></>;

    switch (location.pathname) {
        case Routes.tracks:
            currentPage = <TracksPage />;
            break;
        case Routes.album:
            currentPage = <AlbumPage />;
            break;
        case Routes.albums:
            currentPage = <AlbumsPage />;
            break;
        case Routes.artist:
            currentPage = <ArtistPage />;
            break;
        case Routes.artists:
            currentPage = <ArtistsPage />;
            break;
        default:
            history.replace(Routes.tracks);
    }

    const topBarContainer = document.querySelector(
        '.main-topBar-topbarContentWrapper'
    );

    const showTracksProgress = albumCount === 0;
    const showAlbumsProgress = albumCount > 0;

    // TODO: localize progress labels ?

    return (
        <>
            <div className={styles['full-size-container']}>
                <>
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
                                    {`Processing album ${processedAlbums} of ${albumCount}...`}
                                </p>
                            )}
                        </div>
                    )}
                </>
            </div>
            {topBarContainer !== null &&
                ReactDOM.createPortal(
                    <TopBarContent
                        onItemClicked={(item) => history.push(item.href)}
                        items={topBarItems}
                        activeItem={
                            topBarItems.find((i) =>
                                i.href.startsWith(location.pathname)
                            ) ?? topBarItems[0]
                        }
                    />,
                    topBarContainer
                )}
        </>
    );
}

export default App;
