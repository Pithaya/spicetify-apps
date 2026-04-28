import React, { type PropsWithChildren } from 'react';

export type Props = {
    isExecuting: true | undefined;
    isSelected: boolean;
    classname?: string;
};

export function Node(props: Readonly<PropsWithChildren<Props>>): JSX.Element {
    return (
        <div
            className={Spicetify.classnames(
                'tw:bg-spice-main-elevated tw:rounded-sm tw:text-base',
                props.isExecuting
                    ? 'tw:outline-spice-button tw:rounded-md tw:outline-2 tw:outline-solid'
                    : '',
                !props.isExecuting && props.isSelected
                    ? 'tw:outline-spice-button-transparent tw:rounded-md tw:outline-2 tw:outline-solid'
                    : '',
                props.classname,
            )}
        >
            {props.children}
        </div>
    );
}
