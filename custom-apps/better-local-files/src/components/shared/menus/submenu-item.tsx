import React, { useRef } from 'react';

export type Props = {
    label: string;
    submenu: JSX.Element;
};

export function SubmenuItem(props: Readonly<Props>): JSX.Element {
    const isMenuOpened = useRef(false);

    return (
        <Spicetify.ReactComponent.ContextMenu
            trigger="click"
            action="toggle"
            placement="right-end"
            renderInline={true}
            menu={props.submenu}
        >
            <li
                className="main-contextMenu-menuItem"
                onMouseEnter={(e) => {
                    e.currentTarget.click();
                    isMenuOpened.current = true;
                }}
            >
                <button
                    className="main-contextMenu-menuItemButton"
                    role="menuitem"
                    tabIndex={-1}
                >
                    <span
                        dir="auto"
                        className="ellipsis-one-line main-contextMenu-menuItemLabel"
                        style={{ fontSize: '0.875rem' }}
                    >
                        <span>{props.label}</span>
                    </span>
                    <span>
                        <svg
                            height="16"
                            width="16"
                            aria-hidden="true"
                            className="main-contextMenu-subMenuIcon"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                        >
                            <path d="M14 10 8 4l-6 6h12z"></path>
                        </svg>
                    </span>
                </button>
            </li>
        </Spicetify.ReactComponent.ContextMenu>
    );
}
