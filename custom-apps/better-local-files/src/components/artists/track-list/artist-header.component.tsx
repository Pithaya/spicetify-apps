import styles from '../../../css/app.module.scss';
import React from 'react';
import { ArtistItem } from 'custom-apps/better-local-files/src/models/artist-item';

export interface IProps {
    artist: ArtistItem;
}

export function ArtistHeader(props: IProps) {
    return (
        <>
            <div className={`${styles.header}`}>
                <div className={styles['image-container']}>
                    <img
                        src={props.artist.image}
                        alt="artist image"
                        className="main-image-image main-entityHeader-image main-entityHeader-shadow main-image-loaded"
                    />
                </div>
                <div className={styles['text-container']}>
                    <h2 className="main-entityHeader-subtitle main-entityHeader-small main-entityHeader-uppercase main-entityHeader-bold">
                        Artiste
                    </h2>
                    <h1 className="main-entityHeader-title">
                        {props.artist.name}
                    </h1>
                </div>
            </div>
        </>
    );
}
