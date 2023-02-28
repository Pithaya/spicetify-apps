import styles from '../../css/app.module.scss';
import React from 'react';

export interface HeaderProps {
    image: JSX.Element;
    title: string | JSX.Element;
    subtitle?: string | JSX.Element;
    metadata?: JSX.Element;
    additionalText?: JSX.Element;
}

export function Header(props: HeaderProps) {
    return (
        <>
            <div className={`${styles.header}`}>
                <div className={styles['image-container']}>{props.image}</div>
                <div className={styles['text-container']}>
                    {props.subtitle && (
                        <h2 className="main-entityHeader-subtitle main-entityHeader-small main-entityHeader-uppercase main-entityHeader-bold">
                            {props.subtitle}
                        </h2>
                    )}
                    <h1 className="main-entityHeader-title">{props.title}</h1>
                    {props.metadata && (
                        <div className="main-entityHeader-metaData">
                            {props.metadata}
                        </div>
                    )}
                    {props.additionalText}
                </div>
            </div>
        </>
    );
}
