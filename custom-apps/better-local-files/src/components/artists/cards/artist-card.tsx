import React, { useRef } from 'react';
import styles from '../../../css/app.module.scss';
import { useIntersectionObserver } from '../../../hooks/use-intersection-observer';
import { navigateTo } from '../../../helpers/history-helper';
import { Routes } from '../../../constants/constants';
import { PlayButton } from '../../shared/buttons/play-button';
import { ArtistItem } from 'custom-apps/better-local-files/src/models/artist-item';

export interface IProps {
    artist: ArtistItem;
    onPlayClicked: (a: ArtistItem) => void;
}

export function ArtistCard(props: IProps) {
    const ref = useRef<HTMLDivElement>(null);
    const visible = useIntersectionObserver(ref);

    const placeholder = <div style={{ height: '260px' }}></div>;

    return (
        <div ref={ref}>
            {visible ? (
                <div
                    className={`${styles['main-card-card']} main-card-card`}
                    onClick={() =>
                        navigateTo(Routes.artist, { uri: props.artist.uri })
                    }
                >
                    <div draggable="true" className="main-card-draggable">
                        <div className="main-card-imageContainer">
                            <div className="main-cardImage-imageWrapper main-cardImage-circular">
                                <div>
                                    <img
                                        aria-hidden="false"
                                        draggable="false"
                                        loading="lazy"
                                        src={props.artist.image}
                                        alt="artist image"
                                        className="main-image-image main-cardImage-image main-cardImage-circular main-image-loading main-image-loaded"
                                    />
                                </div>
                            </div>
                            <div className="main-card-PlayButtonContainer">
                                <div className="main-playButton-PlayButton">
                                    <PlayButton
                                        aria-label="Lire XXX"
                                        size={42}
                                        iconSize={20}
                                        onClick={() =>
                                            props.onPlayClicked(props.artist)
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
                                    Artiste
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                placeholder
            )}
        </div>
    );
}
