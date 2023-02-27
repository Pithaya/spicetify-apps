import styles from './css/app.module.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { History } from '@shared';
import { Routes, topBarItems } from './constants/constants';
import { TopBarContent } from './components/top-bar/top-bar-content.component';
import { TracksPage } from './components/pages/tracks.page';
import { AlbumPage } from './components/pages/album.page';
import { AlbumsPage } from './components/pages/albums.page';
import { ArtistPage } from './components/pages/artist.page';
import { ArtistsPage } from './components/pages/artists.page';

function App() {
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
            <div className={`${styles.container} ${styles.padded}`}>
                {currentPage}
            </div>
            {topBarContainer !== null &&
                ReactDOM.createPortal(
                    <TopBarContent
                        onItemClicked={(item) => history.push(item.href)}
                        items={topBarItems}
                        activeItem={
                            topBarItems.find(
                                (i) => i.href === location.pathname
                            ) ?? topBarItems[0]
                        }
                    />,
                    topBarContainer
                )}
        </>
    );
}

export default App;
