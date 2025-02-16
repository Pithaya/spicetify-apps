import React, { type MouseEvent } from 'react';

export type Props = {
    label: string;
    submenu: JSX.Element;
    leadingIcon?: JSX.Element;
};

export function SubmenuItem(props: Readonly<Props>): JSX.Element {
    // Menu items stop propagation of events, so the context menu doesn't open on click
    const menuItemString = Spicetify.ReactDOMServer.renderToString(
        <Spicetify.ReactComponent.MenuItem
            leadingIcon={props.leadingIcon}
            trailingIcon={
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
            }
        >
            <span>{props.label}</span>
        </Spicetify.ReactComponent.MenuItem>,
    );

    return (
        <Spicetify.ReactComponent.ContextMenu
            trigger="click"
            action="toggle"
            placement="right-end"
            renderInline={true}
            menu={props.submenu}
        >
            <div
                role="menu"
                tabIndex={0}
                onMouseEnter={(e: MouseEvent<HTMLDivElement>) => {
                    e.currentTarget.click();
                }}
                dangerouslySetInnerHTML={{
                    __html: menuItemString,
                }}
            ></div>
        </Spicetify.ReactComponent.ContextMenu>
    );
}
