import React, { useRef } from 'react';
import styles from '../../../css/app.module.scss';
import { useIntersectionObserver } from '../../../hooks/use-intersection-observer';
import { navigateTo } from '../../../helpers/history-helper';
import { Routes } from '../../../constants/constants';
import { PlayButton } from '../../shared/buttons/play-button';
import { Album } from 'custom-apps/better-local-files/src/models/album';

export interface IProps {
    album: Album;
    onPlayClicked: (a: Album) => void;
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
                                {props.album.artists
                                    .map((a) => (
                                        <span>
                                            <a
                                                href="#"
                                                draggable="false"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigateTo(
                                                        Routes.artist,
                                                        a.uri
                                                    );
                                                }}
                                            >
                                                {a.name}
                                            </a>
                                        </span>
                                    ))
                                    .reduce(
                                        (
                                            accu: JSX.Element[] | null,
                                            elem: JSX.Element
                                        ) => {
                                            return accu === null
                                                ? [elem]
                                                : [...accu, <>{', '}</>, elem];
                                        },
                                        null
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
