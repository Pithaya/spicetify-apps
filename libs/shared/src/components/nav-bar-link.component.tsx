import { HistoryEntry, Platform } from '../platform';
import React, { useEffect, useState } from 'react';

export interface NavBarLinkProps {
    icon: JSX.Element;
    activeIcon: JSX.Element;
    href: string;
    label: string;
}

export function NavBarLink(props: NavBarLinkProps) {
    const history = Platform.History;
    const initialActive = history.location.pathname === props.href;

    const [active, setActive] = useState(initialActive);

    useEffect(() => {
        function handleHistoryChange(e: HistoryEntry) {
            setActive(e.pathname === props.href);
        }

        const unsubscribe = history.listen(handleHistoryChange);
        return unsubscribe;
    }, []);

    function navigate() {
        history.push(props.href);
    }

    return (
        <>
            <li className="main-navBar-navBarItem" data-id={props.href}>
                <a
                    draggable="false"
                    className={`link-subtle main-navBar-navBarLink ${
                        active ? 'main-navBar-navBarLinkActive active' : ''
                    }`}
                    onClick={navigate}
                >
                    <div className="icon collection-icon">{props.icon}</div>
                    <div className="icon collection-active-icon">
                        {props.activeIcon}
                    </div>
                    <span className="ellipsis-one-line main-type-mestoBold">
                        {props.label}
                    </span>
                </a>
            </li>
        </>
    );
}
