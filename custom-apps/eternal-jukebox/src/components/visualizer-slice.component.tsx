import React, { useState } from 'react';
import styles from '../css/app.module.scss';
import { IBeatDrawData } from '../models/visualization/beat-draw-data.interface';

interface IProps {
    drawData: IBeatDrawData;
}

export function VisualizerSlice(props: IProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <path
            className={styles['beat-path']}
            fill={
                props.drawData.beat.isPlaying || isHovered
                    ? props.drawData.activeColor
                    : props.drawData.color
            }
            d={props.drawData.drawCommand}
            onMouseOver={() => setIsHovered(true)}
            onMouseOut={() => setIsHovered(false)}
        >
            <title>Beat {props.drawData.beat.index}</title>
        </path>
    );
}
