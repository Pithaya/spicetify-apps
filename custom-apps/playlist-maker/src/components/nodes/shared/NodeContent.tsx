import React, { type PropsWithChildren } from 'react';
import styles from './NodeContent.module.scss';

export function NodeContent(
    props: Readonly<PropsWithChildren<{ className?: string }>>,
): JSX.Element {
    return (
        <div className={`${styles['node-content']} ${props.className ?? ''}`}>
            {props.children}
        </div>
    );
}
