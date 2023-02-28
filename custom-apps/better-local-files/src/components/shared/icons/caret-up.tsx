import React from 'react';

export interface IProps {
    className?: string;
}

export function CaretUp(props: IProps) {
    return (
        <svg
            role="img"
            height="16"
            width="16"
            viewBox="0 0 16 16"
            fill="var(--spice-text)"
            className={props.className}
        >
            <path d="M14 10L8 4l-6 6h12z"></path>
        </svg>
    );
}
