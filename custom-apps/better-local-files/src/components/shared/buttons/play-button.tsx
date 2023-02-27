import styles from '../../../css/app.module.scss';
import React, { CSSProperties } from 'react';
import { Play } from 'lucide-react';

export interface IProps {
    onClick: () => void;
    size: number;
    iconSize: number;
}

export function PlayButton(props: IProps) {
    const style: CSSProperties = {
        height: `${props.size}px`,
        width: `${props.size}px`,
        borderRadius: `${props.size / 2}px`,
    };

    return (
        <button
            className={styles['play-button']}
            aria-label="Lecture"
            onClick={props.onClick}
            style={style}
        >
            <Play
                fill="var(--spice-main)"
                stroke="var(--spice-main)"
                size={props.iconSize}
            ></Play>
        </button>
    );
}
