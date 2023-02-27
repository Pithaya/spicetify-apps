import styles from '../css/app.module.scss';
import React from 'react';
import { AlbumItem } from '../models/album-item';
import { navigateTo } from './helpers/history-helper';
import { Routes } from '../constants/constants';

export interface IProps {
    album: AlbumItem;
}

export function AlbumHeader(props: IProps) {
    return (
        <>
            <div className={`${styles.header}`}>
                <div className={styles['image-container']}>
                    <img
                        src={props.album.image}
                        alt="album image"
                        className="main-image-image main-entityHeader-image main-entityHeader-shadow main-image-loaded"
                    />
                </div>
                <div className={styles['text-container']}>
                    <h2 className="main-entityHeader-subtitle main-entityHeader-small main-entityHeader-uppercase main-entityHeader-bold">
                        Album
                    </h2>
                    <h1 className="main-entityHeader-title">
                        {props.album.name}
                    </h1>
                    <div className="main-entityHeader-metaData">
                        {props.album.artists
                            .map((a) => (
                                <span>
                                    <a
                                        draggable="false"
                                        onClick={() =>
                                            navigateTo(Routes.artist, {
                                                uri: a.uri,
                                            })
                                        }
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
                                        : [
                                              ...accu,
                                              <span className="main-entityHeader-divider"></span>,
                                              elem,
                                          ];
                                },
                                null
                            )}
                        <span className="main-entityHeader-metaDataText">
                            {props.album.tracks.length} titres
                        </span>
                        <span className="main-entityHeader-metaDataText">
                            {Spicetify.Player.formatTime(
                                props.album.tracks
                                    .map((t) => t.duration.milliseconds)
                                    .reduce((total, current) => total + current)
                            )}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}
