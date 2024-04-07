import { TextComponent } from '@shared/components/ui/text/text';
import styles from './slider-container.module.scss';
import React from 'react';

export type Props = {
    slider: JSX.Element;
    label: string;
    subLabel: string;
    minLabel: string;
    maxLabel: string;
    containerWidth?: string;
    style?: React.CSSProperties;
};

export function SliderContainer(props: Readonly<Props>): JSX.Element {
    return (
        <div style={{ width: props.containerWidth, ...props.style }}>
            <div>
                <TextComponent elementType="h3" variant="violaBold">
                    {props.label}
                </TextComponent>
                <TextComponent
                    style={{ display: 'block' }}
                    elementType="small"
                    semanticColor="textSubdued"
                    paddingBottom="8px"
                >
                    {props.subLabel}
                </TextComponent>
            </div>

            {props.slider}

            <div className={styles['range-subtext']}>
                <TextComponent elementType="small" semanticColor="textSubdued">
                    {props.minLabel}
                </TextComponent>
                <TextComponent elementType="small" semanticColor="textSubdued">
                    {props.maxLabel}
                </TextComponent>
            </div>
        </div>
    );
}
