import React, { type PropsWithChildren } from 'react';
import styles from './Node.module.scss';

export type Props = {
    isExecuting: true | undefined;
};

export function Node(props: Readonly<PropsWithChildren<Props>>): JSX.Element {
    return (
        <div
            className={Spicetify.classnames(
                styles['node'],
                props.isExecuting ? styles['executing'] : '',
            )}
        >
            {props.children}
        </div>
    );
}
