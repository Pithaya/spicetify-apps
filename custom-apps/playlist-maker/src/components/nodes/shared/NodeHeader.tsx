import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import React from 'react';

export type Props = {
    label: string;
    backgroundColor: string;
    textColor: string;
};

export function NodeHeader(props: Readonly<Props>): JSX.Element {
    return (
        <div
            className="rounded-t-sm border-t !px-2 !py-0.5"
            style={{
                backgroundColor: props.backgroundColor,
                color: props.textColor,
            }}
        >
            <TextComponent paddingBottom="0" weight="bold">
                {props.label}
            </TextComponent>
        </div>
    );
}

export function SourceNodeHeader(): JSX.Element {
    return (
        <NodeHeader
            label="Source"
            backgroundColor="cornflowerblue"
            textColor="black"
        />
    );
}

export function ProcessingNodeHeader(): JSX.Element {
    return (
        <NodeHeader
            label="Processing"
            backgroundColor="greenyellow"
            textColor="black"
        />
    );
}

export function FilterNodeHeader(): JSX.Element {
    return (
        <NodeHeader label="Filter" backgroundColor="violet" textColor="black" />
    );
}

export function ResultNodeHeader(): JSX.Element {
    return (
        <NodeHeader label="Result" backgroundColor="orange" textColor="black" />
    );
}
