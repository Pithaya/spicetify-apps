import { getPlatformApiOrThrow } from '@shared/utils/spicetify-utils';
import React, { type MouseEvent, useEffect, useState } from 'react';
import type { History, HistoryEntry } from '../../platform/history';

export type IconNavLinkProps = {
    icon: JSX.Element;
    activeIcon: JSX.Element;
    href: string;
    label: string;
    className?: string;
};

export function IconNavLink(props: Readonly<IconNavLinkProps>): JSX.Element {
    const history = getPlatformApiOrThrow<History>('History');
    const initialActive = history.location.pathname === props.href;

    const href = props.href;

    const [active, setActive] = useState(initialActive);

    useEffect(() => {
        function handleHistoryChange(e: HistoryEntry): void {
            setActive(e.pathname === href);
        }

        const history = getPlatformApiOrThrow<History>('History');
        const unsubscribe = history.listen(handleHistoryChange);
        return unsubscribe;
    }, [href]);

    function navigate(): void {
        history.push(props.href);
    }

    return (
        <Spicetify.ReactComponent.TooltipWrapper label={props.label}>
            <Spicetify.ReactComponent.ButtonTertiary
                aria-label={props.label}
                buttonSize={'md'}
                onClick={(e: MouseEvent) => {
                    e.stopPropagation();
                    navigate();
                }}
                className={Spicetify.classnames(
                    'link-subtle',
                    'main-globalNav-navLink',
                    'main-globalNav-link-icon',
                    'custom-navlink',
                    {
                        'main-globalNav-navLinkActive': active,
                    },
                    props.className,
                )}
                iconOnly={() => (active ? props.activeIcon : props.icon)}
            ></Spicetify.ReactComponent.ButtonTertiary>
        </Spicetify.ReactComponent.TooltipWrapper>
    );
}
