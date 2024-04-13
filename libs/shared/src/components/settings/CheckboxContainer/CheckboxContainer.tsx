import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { CheckboxComponent } from '@shared/components/inputs/CheckboxComponent/CheckboxComponent';
import styles from './CheckboxContainer.module.scss';
import React from 'react';

type Props = {
    inputId: string;
    value: boolean;
    label: string;
    subLabel: string;
    onChange: (value: boolean) => void;
};

/**
 * Container for a checkbox and label for a settings page.
 * @param props Props for the component.
 * @returns The component.
 */
export function CheckboxContainer(props: Readonly<Props>): JSX.Element {
    return (
        <div className={styles['checkbox-container']}>
            <div>
                <TextComponent elementType="h3" variant="violaBold">
                    {props.label}
                </TextComponent>
                <TextComponent elementType="small" semanticColor="textSubdued">
                    {props.subLabel}
                </TextComponent>
            </div>

            <CheckboxComponent
                inputId={props.inputId}
                value={props.value}
                onChange={props.onChange}
            />
        </div>
    );
}
