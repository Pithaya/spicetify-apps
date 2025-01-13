import React from 'react';
import styles from './NodeHeader.module.scss';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';

export type Props = {
    label: string;
    backgroundColor: string;
    textColor: string;
};

export function NodeHeader(props: Readonly<Props>): JSX.Element {
    return (
        <div
            className={styles['node-header']}
            style={{
                backgroundColor: props.backgroundColor,
                color: props.textColor,
            }}
        >
            <TextComponent paddingBottom="0" weight="bold">
                {props.label}
            </TextComponent>
        </div>
    );
}
