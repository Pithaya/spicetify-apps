import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import React, { type PropsWithChildren } from 'react';
import { type FieldError } from 'react-hook-form';
import { InputError } from '../../inputs/InputError';
import styles from './NodeField.module.scss';

export type Props = PropsWithChildren<{
    label: string;
    tooltip?: string;
    error: FieldError | undefined;
}>;

// TODO: Add nodrag on node field & remove from input components

export function NodeField(props: Readonly<Props>): JSX.Element {
    const label = (
        <TextComponent elementType="small">{props.label}</TextComponent>
    );

    return (
        <label>
            {props.tooltip && (
                <Spicetify.ReactComponent.TooltipWrapper
                    label={props.tooltip}
                    showDelay={100}
                >
                    {label}
                </Spicetify.ReactComponent.TooltipWrapper>
            )}
            {!props.tooltip && label}
            <div className={styles['input-wrapper']}>
                {props.children}
                <InputError error={props.error} />
            </div>
        </label>
    );
}
