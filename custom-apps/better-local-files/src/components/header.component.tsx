import styles from '../css/app.module.scss';
import React from 'react';
import { Folder } from 'lucide-react';

export interface IProps {
    tracksCount: number;
}

export function Header(props: IProps) {
    return (
        <>
            <div className={`${styles.header}`}>
                <div className={styles['image-container']}>
                    <Folder fill="var(--spice-text)" size={100}></Folder>
                </div>
                <div className={styles['text-container']}>
                    <h1 className="main-entityHeader-title">Local files</h1>
                    <p>Fichiers de votre ordinateur</p>
                    <p>{props.tracksCount} titres</p>
                </div>
            </div>
        </>
    );
}
