import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { CircleHelp } from 'lucide-react';
import React, { type PropsWithChildren } from 'react';
import { type FieldError } from 'react-hook-form';
import { InputError } from '../../inputs/InputError';

export type Props = PropsWithChildren<{
    label: string;
    tooltip?: string;
    error: FieldError | undefined;
}>;

export function NodeField(props: Readonly<Props>): JSX.Element {
    return (
        <label className="flex flex-row items-start justify-between gap-5">
            <div className="flex items-center gap-1">
                <TextComponent elementType="small">{props.label}</TextComponent>
                {props.tooltip && (
                    <Spicetify.ReactComponent.TooltipWrapper
                        label={props.tooltip}
                        showDelay={100}
                    >
                        <CircleHelp
                            size={12}
                            strokeWidth={1.5}
                            className="cursor-help"
                        />
                    </Spicetify.ReactComponent.TooltipWrapper>
                )}
            </div>

            <div className="w-[200px]">
                {props.children}
                <InputError error={props.error} />
            </div>
        </label>
    );
}
