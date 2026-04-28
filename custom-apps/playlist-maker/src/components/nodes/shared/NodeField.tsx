import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { CircleHelp } from 'lucide-react';
import React, { type PropsWithChildren } from 'react';
import { type FieldError } from 'react-hook-form';
import { InputError } from '../../inputs/InputError';

export type Props = PropsWithChildren<{
    label: string;
    tooltip?: string;
    error: FieldError | undefined;
    small?: boolean;
    centerFields?: boolean;
}>;

export function NodeField(props: Readonly<Props>): JSX.Element {
    return (
        <label
            className={Spicetify.classnames(
                'tw:flex tw:flex-row tw:justify-between tw:gap-5',
                (props.centerFields ?? false)
                    ? 'tw:items-center'
                    : 'tw:items-start',
            )}
        >
            <div className="tw:flex tw:items-center tw:gap-1">
                <TextComponent elementType="small">{props.label}</TextComponent>
                {props.tooltip && (
                    <Spicetify.ReactComponent.TooltipWrapper
                        label={props.tooltip}
                        showDelay={100}
                    >
                        <CircleHelp
                            size={12}
                            strokeWidth={1.5}
                            className="tw:cursor-help"
                        />
                    </Spicetify.ReactComponent.TooltipWrapper>
                )}
            </div>

            <div
                className={
                    (props.small ?? false) ? 'tw:w-[50px]' : 'tw:w-[200px]'
                }
            >
                {props.children}
                <InputError error={props.error} />
            </div>
        </label>
    );
}
