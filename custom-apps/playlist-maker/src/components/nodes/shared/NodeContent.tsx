import React, { type PropsWithChildren } from 'react';

export function NodeContent(
    props: Readonly<PropsWithChildren<{ className?: string }>>,
): JSX.Element {
    return (
        <div
            className={Spicetify.classnames(
                'nowheel nodrag tw:flex tw:cursor-default tw:flex-col tw:gap-1 tw:p-2',
                props.className,
            )}
        >
            {props.children}
        </div>
    );
}
