import React, { useRef, useState } from 'react';

export interface IProps {
    parentElement: HTMLElement;
}

export function SubMenu(props: IProps) {
    const [isHovered, setIsHovered] = useState(true);
    const subMenuRef = useRef(null);

    const subMenuIcon = (
        <svg
            role="img"
            height="16"
            width="16"
            fill="currentColor"
            className="main-contextMenu-subMenuIcon"
            viewBox="0 0 16 16"
        >
            <path d="M13 10L8 4.206 3 10z"></path>
        </svg>
    );

    function getTransform(): string {
        if (subMenuRef.current === null) {
            return '';
        }

        const { y: parentY, width: parentWidth } =
            props.parentElement.getBoundingClientRect();
        const { width: thisWidth, height: thisHeight } = (
            subMenuRef.current as HTMLElement
        ).getBoundingClientRect();
        let x = 0,
            y = props.parentElement.offsetTop;

        const placement = 'bottom-start';

        switch (placement) {
            case 'top-start':
            case 'bottom-start':
                x += parentWidth - 5;
                break;
            case 'top-end':
            case 'bottom-end':
            default:
                x -= thisWidth - 5;
                break;
        }
        let realY = y + parentY;
        if (realY + thisHeight > window.innerHeight) {
            y -= realY + thisHeight - window.innerHeight;
        }

        return `translate(${x}px, ${y}px)`;
    }

    return (
        <>
            <Spicetify.ReactComponent.MenuItem
                divider="before"
                icon={subMenuIcon}
                onMouseOver={() => setIsHovered(true)}
                onMouseOut={() => setIsHovered(false)}
            >
                <span>Ajouter à la playlist</span>
            </Spicetify.ReactComponent.MenuItem>

            <div
                style={{
                    position: 'absolute',
                    transform: getTransform(),
                    visibility: isHovered ? 'visible' : 'hidden',
                }}
            >
                <Spicetify.ReactComponent.Menu ref={subMenuRef}>
                    <Spicetify.ReactComponent.MenuItem>
                        <span>test</span>
                    </Spicetify.ReactComponent.MenuItem>
                </Spicetify.ReactComponent.Menu>
            </div>
        </>
    );
}
