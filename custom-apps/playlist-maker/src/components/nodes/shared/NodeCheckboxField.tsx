import React, { type PropsWithChildren } from 'react';
import { type FieldError } from 'react-hook-form';
import { NodeField } from './NodeField';

export type Props = PropsWithChildren<{
    label: string;
    tooltip?: string;
    error: FieldError | undefined;
}>;

export function NodeCheckboxField(props: Readonly<Props>): JSX.Element {
    return (
        <NodeField label={props.label} error={props.error}>
            <div className="flex justify-end">{props.children}</div>
        </NodeField>
    );
}
