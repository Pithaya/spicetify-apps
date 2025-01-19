import React from 'react';
import styles from './HelpButton.module.scss';
import { CircleHelp } from 'lucide-react';
import { HelpModal } from './HelpModal';

export function HelpButton(): JSX.Element {
    return (
        <div className={styles['help-panel']}>
            <Spicetify.ReactComponent.TooltipWrapper
                label="Help"
                placement="right"
            >
                <Spicetify.ReactComponent.ButtonTertiary
                    aria-label="Help"
                    iconOnly={() => <CircleHelp size={20} strokeWidth={1.5} />}
                    buttonSize="sm"
                    onClick={() => {
                        Spicetify.PopupModal.display({
                            title: 'Help',
                            content: React.createElement(HelpModal) as any,
                            isLarge: true,
                        });
                    }}
                    className={styles['help-button']}
                ></Spicetify.ReactComponent.ButtonTertiary>
            </Spicetify.ReactComponent.TooltipWrapper>
        </div>
    );
}
