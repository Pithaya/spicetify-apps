import styles from '../../../css/app.module.scss';
import React from 'react';
import { SpotifyIcon } from '@shared/components/ui/SpotifyIcon/SpotifyIcon';

export type Props = {
    label: string;
    menu: JSX.Element;
};

export function MoreButton(props: Readonly<Props>): JSX.Element {
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
                    <Spicetify.ReactComponent.ButtonTertiary
                        aria-label={props.label}
                        aria-haspopup="menu"
                        iconOnly={() => <SpotifyIcon icon="more" />}
                    ></Spicetify.ReactComponent.ButtonTertiary>
                </Spicetify.ReactComponent.ContextMenu>
            </div>
        </Spicetify.ReactComponent.TooltipWrapper>
    );
}
