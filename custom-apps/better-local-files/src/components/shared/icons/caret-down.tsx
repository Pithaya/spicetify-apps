import React from 'react';

export interface IProps {
    className?: string;
}

export function CaretDown(props: IProps) {
    return (
        <svg
            role="img"
            height="16"
            width="16"
            viewBox="0 0 16 16"
            fill="var(--spice-text)"
            className={props.className}
        >
            <path d="M14 6l-6 6-6-6h12z"></path>
        </svg>
    );
}
