import React, { type PropsWithChildren } from 'react';

export function NodeContent(
    props: Readonly<PropsWithChildren<{ className?: string }>>,
): JSX.Element {
    return (
        <div
            className={Spicetify.classnames(
                'nowheel nodrag flex cursor-default flex-col gap-1 !p-2',
                props.className,
            )}
        >
            {props.children}
        </div>
    );
}
