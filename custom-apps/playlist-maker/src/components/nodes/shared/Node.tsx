import React, { type PropsWithChildren } from 'react';

export type Props = {
    isExecuting: true | undefined;
    isSelected: boolean;
};

export function Node(props: Readonly<PropsWithChildren<Props>>): JSX.Element {
    return (
        <div
            className={Spicetify.classnames(
                'bg-spice-main-elevated rounded-sm text-base',
                props.isExecuting
                    ? '!outline-spice-button rounded-md !outline-2 !outline-solid'
                    : '',
                !props.isExecuting && props.isSelected
                    ? '!outline-spice-button-transparent rounded-md !outline-2 !outline-solid'
                    : '',
            )}
        >
            {props.children}
        </div>
    );
}
