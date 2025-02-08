import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { CircleHelp } from 'lucide-react';
import React from 'react';

type Props = {
    title: string;
    tooltip?: string;
};

export function NodeTitle(props: Readonly<Props>): JSX.Element {
    return (
        <div className="!mb-2 flex items-center gap-2">
            <TextComponent elementType="p" weight="bold" paddingBottom="0">
                {props.title}
            </TextComponent>
            {props.tooltip && (
                <Spicetify.ReactComponent.TooltipWrapper
                    label={props.tooltip}
                    showDelay={100}
                >
                    <CircleHelp
                        size={14}
                        strokeWidth={1.5}
                        className="cursor-help"
                    />
                </Spicetify.ReactComponent.TooltipWrapper>
            )}
        </div>
    );
}
