import React from 'react';

export type Props = {
    className?: string;
};

export function CaretUp(props: Readonly<Props>): JSX.Element {
    return (
        <svg
            height="16"
            width="16"
            viewBox="0 0 16 16"
            fill="var(--text-bright-accent)"
            className={props.className}
        >
            <path d="M14 10L8 4l-6 6h12z"></path>
        </svg>
    );
}
