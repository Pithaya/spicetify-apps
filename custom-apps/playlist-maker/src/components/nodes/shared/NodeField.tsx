import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import React, { type PropsWithChildren } from 'react';
import { type FieldError } from 'react-hook-form';
import { InputError } from '../../inputs/InputError';

// TODO: help icon for the tooltip

export type Props = PropsWithChildren<{
    label: string;
    tooltip?: string;
    error: FieldError | undefined;
}>;

export function NodeField(props: Readonly<Props>): JSX.Element {
    const label = (
        <TextComponent elementType="small">{props.label}</TextComponent>
    );

    return (
        <label className="flex flex-row items-start justify-between gap-5">
            {props.tooltip && (
                <Spicetify.ReactComponent.TooltipWrapper
                    label={props.tooltip}
                    showDelay={100}
                >
                    {label}
                </Spicetify.ReactComponent.TooltipWrapper>
            )}
            {!props.tooltip && label}
            <div className="w-[200px]">
                {props.children}
                <InputError error={props.error} />
            </div>
        </label>
    );
}
