import { MultiTrackMenu } from '@shared/components/menus/MultiTrackMenu';
import { PlayButton } from '@shared/components/ui/PlayButton';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { useIntersectionObserver } from '@shared/hooks/use-intersection-observer';
import { ARTIST_ROUTE } from 'custom-apps/better-local-files/src/constants/constants';
import { getArtistTrackUris } from 'custom-apps/better-local-files/src/db/db';
import type { CachedArtist } from 'custom-apps/better-local-files/src/models/cached-artist';
import { useLiveQuery } from 'dexie-react-hooks';
import React, { useRef } from 'react';
import styles from '../../../css/app.module.scss';
import { navigateTo } from '../../../utils/history.utils';

export type Props = {
    artist: CachedArtist;
    onPlayClicked: (a: CachedArtist) => void;
};

export function ArtistCard(props: Readonly<Props>): JSX.Element {
    const ref = useRef<HTMLDivElement>(null);
    const visible = useIntersectionObserver(ref);

    // Fetch the artist's track URIs only when the card becomes visible, so we
    // don't issue a query for every off-screen artist on page load.
    const trackUris = useLiveQuery(
        () =>
            visible
                ? getArtistTrackUris(props.artist.uri)
                : Promise.resolve([]),
        [visible, props.artist.uri],
        [],
    );

    const placeholder = <div style={{ height: '260px' }}></div>;
    const imageFallback = (
        <div
            className={styles['center-container']}
            style={{
                height: '100%',
                left: 0,
                position: 'absolute',
                top: 0,
                width: '100%',
            }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="50"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M9 18V5l12-2v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
            </svg>
        </div>
    );

    return (
        <div ref={ref}>
            {visible ? (
                <Spicetify.ReactComponent.ContextMenu
                    trigger="right-click"
                    action="toggle"
                    menu={<MultiTrackMenu tracksUri={trackUris} />}
                >
                    <div
                        tabIndex={0}
                        className={`${styles['main-card-card']} main-card-card`}
                        onClick={() => {
                            navigateTo(ARTIST_ROUTE, props.artist.uri);
                        }}
                    >
                        <div draggable="true" className="main-card-draggable">
                            <div className="main-card-imageContainer main-card-imageContainerOld">
                                <div className="main-cardImage-imageWrapper main-cardImage-circular">
                                    {props.artist.image !== '' ? (
                                        <img
                                            aria-hidden="false"
                                            draggable="false"
                                            loading="lazy"
                                            src={props.artist.image}
                                            alt="artist avatar"
                                            className="main-image-image main-cardImage-image main-cardImage-circular main-image-loading main-image-loaded"
                                            onError={(e) =>
                                                (e.currentTarget.outerHTML =
                                                    Spicetify.ReactDOMServer.renderToString(
                                                        imageFallback,
                                                    ))
                                            }
                                        />
                                    ) : (
                                        imageFallback
                                    )}
                                </div>
                                <div className="main-card-PlayButtonContainer">
                                    <div className="main-playButton-PlayButton">
                                        <PlayButton
                                            size="md"
                                            onClick={() => {
                                                props.onPlayClicked(
                                                    props.artist,
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="main-card-cardMetadata">
                                <TextComponent
                                    className="main-cardHeader-link main-cardHeader-text tw:text-center tw:w-full tw:line-clamp-2"
                                    variant="balladBold"
                                    semanticColor="textBase"
                                    paddingBottom="4px"
                                >
                                    {props.artist.name}
                                </TextComponent>
                            </div>
                        </div>
                    </div>
                </Spicetify.ReactComponent.ContextMenu>
            ) : (
                placeholder
            )}
        </div>
    );
}
