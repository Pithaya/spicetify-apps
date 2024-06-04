import React, { type PropsWithChildren } from 'react';
import styles from './Node.module.scss';

export function Node(props: Readonly<PropsWithChildren>): JSX.Element {
    return <div className={styles['node']}>{props.children}</div>;
}
