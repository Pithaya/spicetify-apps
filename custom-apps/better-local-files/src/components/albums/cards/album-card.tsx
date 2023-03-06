import React, { useRef } from 'react';
import { AlbumItem } from '../../../models/album-item';
import styles from '../../../css/app.module.scss';
import { Play } from 'lucide-react';
import { useIntersectionObserver } from '../../../hooks/use-intersection-observer';
import { navigateTo } from '../../../helpers/history-helper';
import { Routes } from '../../../constants/constants';
import { PlayButton } from '../../shared/buttons/play-button';

export interface IProps {
    album: AlbumItem;
    onPlayClicked: (a: AlbumItem) => void;
}

export function AlbumCard(props: IProps) {
    const ref = useRef<HTMLDivElement>(null);
    const visible = useIntersectionObserver(ref);

    const placeholder = <div style={{ height: '250px' }}></div>;

    return (
        <div ref={ref}>
            {visible ? (
                <div
                    className={`${styles['main-card-card']} main-card-card`}
                    onClick={() => navigateTo(Routes.album, props.album.uri)}
                >
                    <div draggable="true" className="main-card-draggable">
                        <div className="main-card-imageContainer">
                            <div className="main-cardImage-imageWrapper">
                                <div>
                                    <img
                                        aria-hidden="false"
                                        draggable="false"
                                        loading="lazy"
                                        src={props.album.image}
                                        alt="album image"
                                        className="main-image-image main-cardImage-image main-image-loading main-image-loaded"
                                    />
                                </div>
                            </div>
                            <div className="main-card-PlayButtonContainer">
                                <div className="main-playButton-PlayButton">
                                    <PlayButton
                                        aria-label="Lire XXX par XXX"
                                        size={42}
                                        iconSize={20}
                                        onClick={() => {
                                            props.onPlayClicked(props.album);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="main-card-cardMetadata">
                            <span
                                draggable="false"
                                title={props.album.name}
                                className={`${styles['main-cardHeader-link']} main-cardHeader-link`}
                                dir="auto"
                            >
                                <div className="main-cardHeader-text">
                                    {props.album.name}
                                </div>
                            </span>
                            <div className="main-cardSubHeader-root">
                                {props.album.artists.length === 1 ? (
                                    <a
                                        draggable="false"
                                        dir="auto"
                                        href="/artist/57nPqD7z62gDdq37US9XJR"
                                    >
                                        {props.album.artists[0].name}
                                    </a>
                                ) : (
                                    <span className={styles['text-subdued']}>
                                        Multi-interprètes
                                    </span>
                                )}
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
