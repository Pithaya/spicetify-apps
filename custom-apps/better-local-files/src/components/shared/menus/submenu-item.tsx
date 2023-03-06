import React from 'react';

export interface SubmenuItemProps {
    label: string;
    submenu: JSX.Element;
}

export function SubmenuItem(props: SubmenuItemProps) {
    return (
        <Spicetify.ReactComponent.ContextMenu
            trigger="click"
            action="toggle"
            placement="right-start"
            menu={props.submenu}
        >
            <li role="presentation" className="main-contextMenu-menuItem">
                <button
                    className="main-contextMenu-menuItemButton"
                    role="menuitem"
                    tabIndex={-1}
                >
                    <span
                        dir="auto"
                        className="ellipsis-one-line main-contextMenu-menuItemLabel"
                    >
                        <span>{props.label}</span>
                    </span>
                    <span>
                        <svg
                            role="img"
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
