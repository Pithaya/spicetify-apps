import styles from '../../../css/app.module.scss';
import React from 'react';
import { MoreIcon } from '../icons/more-icon';

export interface MoreButtonProps {
    label: string;
    menu: JSX.Element;
}

// TODO: update aria expanded
export function MoreButton(props: MoreButtonProps) {
    console.log(props.label);

    return (
        <Spicetify.ReactComponent.TooltipWrapper
            label={props.label}
            showDelay={100}
        >
            <div className={`${styles['flex-centered']}`}>
                <Spicetify.ReactComponent.ContextMenu
                    trigger="click"
                    action="toggle"
                    menu={props.menu}
                >
                    <button
                        type="button"
                        aria-haspopup="menu"
                        aria-label={props.label}
                        className={`main-moreButton-button ${styles['flex-centered']}`}
                        aria-expanded="false"
                    >
                        <MoreIcon />
                    </button>
                </Spicetify.ReactComponent.ContextMenu>
            </div>
        </Spicetify.ReactComponent.TooltipWrapper>
    );
}
