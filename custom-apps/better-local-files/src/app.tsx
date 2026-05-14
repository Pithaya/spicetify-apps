import { Menu } from '@shared/components/menus/Menu';
import { TopBarContent } from '@shared/components/top-bar/TopBarContent';
import { LoadingIcon } from '@shared/icons/Loading';
import { getPlatform } from '@shared/utils/spicetify-utils';
import { FolderSync, FolderX } from 'lucide-react';
import React, { useEffect } from 'react';
import whatsNew from 'spcr-whats-new';
import { useShallow } from 'zustand/react/shallow';
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
import './css/tailwind.css';
import useAppStore from './stores/store';

function App(): JSX.Element {
    const {
        processedAlbums,
        totalAlbums,
        initCache,
        isLoading,
        rebuildCache,
        clearCache,
    } = useAppStore(
        useShallow((state) => ({
            processedAlbums: state.processedAlbums,
            totalAlbums: state.totalAlbums,
            initCache: state.initCache,
            isLoading: state.isLoading,
            rebuildCache: state.rebuildCache,
            clearCache: state.clearCache,
        })),
    );

    useEffect(() => {
        const init = async (): Promise<void> => {
            await initCache();

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
        };

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

    const showTracksProgress = processedAlbums === 0;
    const showAlbumsProgress = processedAlbums > 0;

    const moreMenu = (
        <Menu>
            <Spicetify.ReactComponent.MenuItem
                onClick={() => {
                    void rebuildCache();
                }}
                disabled={isLoading}
            >
                <div className="tw:flex tw:items-center tw:gap-2">
                    <FolderSync size={16} strokeWidth={1.5} />
                    <span>Rebuild local tracks cache</span>
                </div>
            </Spicetify.ReactComponent.MenuItem>
            <Spicetify.ReactComponent.MenuItem
                onClick={() => {
                    void clearCache();
                }}
                disabled={isLoading}
            >
                <div className="tw:flex tw:items-center tw:gap-2">
                    <FolderX size={16} strokeWidth={1.5} />
                    <span>Clear local tracks cache</span>
                </div>
            </Spicetify.ReactComponent.MenuItem>
        </Menu>
    );

    return (
        <>
            <div
                id="better-local-files"
                className={styles['full-size-container']}
            >
                {isLoading ? (
                    <div
                        className={`${styles['center-container']} ${styles.padded}`}
                    >
                        <LoadingIcon />
                        {showTracksProgress && <p>Processing tracks...</p>}
                        {showAlbumsProgress && (
                            <p>
                                {`Processing album ${processedAlbums.toFixed()} of ${totalAlbums.toFixed()}...`}
                            </p>
                        )}
                    </div>
                ) : (
                    <div
                        className={`${styles['stretch-container']} ${styles.padded}`}
                    >
                        {currentPage}
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
                        moreMenu={moreMenu}
                    />,
                    topBarContainer,
                )}
        </>
    );
}

export default App;
