import styles from './css/app.module.scss';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { History } from '@shared';
import { Routes, topBarItems } from './constants/constants';
import { TopBarContent } from './components/shared/top-bar/top-bar-content.component';
import { TracksPage } from './components/tracks/pages/tracks.page';
import { AlbumPage } from './components/albums/pages/album.page';
import { ArtistsPage } from './components/artists/pages/artists.page';
import { AlbumsPage } from './components/albums/pages/albums.page';
import { ArtistPage } from './components/artists/pages/artist.page';
import { LocalTracksService } from './services/local-tracks-service';
import { LoadingIcon } from './components/shared/icons/loading';

function App() {
    const [isReady, setIsReady] = useState(LocalTracksService.isReady);

    useEffect(() => {
        const subscription = LocalTracksService.isReady$.subscribe((ready) => {
            setIsReady(ready);
        });

        return () => subscription.unsubscribe();
    }, []);

    // No need to await this
    LocalTracksService.init();

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
