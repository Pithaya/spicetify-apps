import React from 'react';

export type Props = {
    className?: string;
};

export function CaretDown(props: Readonly<Props>): JSX.Element {
    return (
        <svg
            height="16"
            width="16"
            viewBox="0 0 16 16"
            fill="var(--text-bright-accent)"
            className={props.className}
        >
            <path d="M14 6l-6 6-6-6h12z"></path>
        </svg>
    );
}
