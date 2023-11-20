import styles from '../../css/app.module.scss';
import React from 'react';

export interface HeaderProps {
    image: JSX.Element;
    title: string | JSX.Element;
    subtitle?: string | JSX.Element;
    metadata?: JSX.Element;
    additionalText?: JSX.Element;
    titleFontSize?: string;
}

export const headerImageFallback = `
<div class="main-image-image main-entityHeader-image main-entityHeader-shadow main-image-loaded ${styles['center-container']}">
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="80"
        height="80"
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

export function Header(props: Readonly<HeaderProps>) {
    return (
        <div className={`${styles.header}`}>
            <div className={styles['image-container']}>{props.image}</div>
            <div className={styles['text-container']}>
                {props.subtitle && (
                    <h2 className="main-entityHeader-subtitle main-entityHeader-small main-entityHeader-uppercase main-entityHeader-bold">
                        {props.subtitle}
                    </h2>
                )}
                <h1
                    className="main-entityHeader-title"
                    style={{ fontSize: props.titleFontSize }}
                >
                    {props.title}
                </h1>
                {props.metadata && (
                    <div className="main-entityHeader-metaData">
                        {props.metadata}
                    </div>
                )}
                {props.additionalText}
            </div>
        </div>
    );
}
