import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { CircleHelp } from 'lucide-react';
import React from 'react';
import styles from './NodeTitle.module.scss';

type Props = {
    title: string;
    tooltip?: string;
};

export function NodeTitle(props: Readonly<Props>): JSX.Element {
    return (
        <div className={styles['node-title']}>
            <TextComponent elementType="p" weight="bold" paddingBottom="0">
                {props.title}
            </TextComponent>
            {props.tooltip && (
                <Spicetify.ReactComponent.TooltipWrapper
                    label={props.tooltip}
                    showDelay={100}
                >
                    <CircleHelp
                        className="nodrag"
                        size={14}
                        strokeWidth={1.5}
                        style={{ cursor: 'help' }}
                    />
                </Spicetify.ReactComponent.TooltipWrapper>
            )}
        </div>
    );
}
