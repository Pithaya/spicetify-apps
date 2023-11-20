import React, { useRef } from 'react';
import styles from '../../../css/app.module.scss';
import { useIntersectionObserver } from '../../../hooks/use-intersection-observer';
import { navigateTo } from '../../../helpers/history-helper';
import { Routes } from '../../../constants/constants';
import { PlayButton } from '../../shared/buttons/play-button';
import { Artist } from 'custom-apps/better-local-files/src/models/artist';
import { MultiTrackMenu } from '../../shared/menus/multi-track-menu';
import { getTranslation } from 'custom-apps/better-local-files/src/helpers/translations-helper';

export interface IProps {
    artist: Artist;
    onPlayClicked: (a: Artist) => void;
}

export function ArtistCard(props: IProps) {
    const ref = useRef<HTMLDivElement>(null);
    const visible = useIntersectionObserver(ref);

    const placeholder = <div style={{ height: '260px' }}></div>;
    const imageFallback = `
    <div class="${styles['center-container']}" style="height: 100%; left: 0; position: absolute; top: 0; width: 100%;">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            >
                <path d="M9 18V5l12-2v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
        </svg>
    </div>`;

    return (
        <div ref={ref}>
            {visible ? (
                <Spicetify.ReactComponent.RightClickMenu
                    menu={
                        <MultiTrackMenu
                            tracks={window.localTracksService.getArtistTracks(
                                props.artist.uri
                            )}
                        />
                    }
                >
                    <div
                        className={`${styles['main-card-card']} main-card-card`}
                        onClick={() =>
                            navigateTo(Routes.artist, props.artist.uri)
                        }
                    >
                        <div draggable="true" className="main-card-draggable">
                            <div className="main-card-imageContainer">
                                <div className="main-cardImage-imageWrapper main-cardImage-circular">
                                    <img
                                        aria-hidden="false"
                                        draggable="false"
                                        loading="lazy"
                                        src={props.artist.image}
                                        alt="artist image"
                                        className="main-image-image main-cardImage-image main-cardImage-circular main-image-loading main-image-loaded"
                                        onError={(e) =>
                                            (e.currentTarget.outerHTML =
                                                imageFallback)
                                        }
                                    />
                                </div>
                                <div className="main-card-PlayButtonContainer">
                                    <div className="main-playButton-PlayButton">
                                        <PlayButton
                                            size="md"
                                            onClick={() =>
                                                props.onPlayClicked(
                                                    props.artist
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="main-card-cardMetadata">
                                <span
                                    draggable="false"
                                    title={props.artist.name}
                                    className={`${styles['main-cardHeader-link']} main-cardHeader-link`}
                                    dir="auto"
                                >
                                    <div className="main-cardHeader-text">
                                        {props.artist.name}
                                    </div>
                                </span>
                                <div className="main-cardSubHeader-root">
                                    <span className={styles['text-subdued']}>
                                        {getTranslation(['artist'])}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Spicetify.ReactComponent.RightClickMenu>
            ) : (
                placeholder
            )}
        </div>
    );
}
