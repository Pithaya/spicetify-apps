import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import React from 'react';
import type { FieldError } from 'react-hook-form';

export type Props = {
    error: FieldError | undefined;
};

export function InputError(props: Readonly<Props>): JSX.Element {
    return (
        <>
            {props.error && (
                <div>
                    <TextComponent
                        elementType="small"
                        semanticColor="textNegative"
                    >
                        {props.error.message}
                    </TextComponent>
                </div>
            )}
        </>
    );
}
