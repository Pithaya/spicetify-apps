import React from 'react';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { type FieldError } from 'react-hook-form';

export type Props = {
    error: FieldError | undefined;
};

function getErrorMessage(error: FieldError): string {
    switch (error.type) {
        case 'required':
            return 'This field is required';
        default:
            return error.message ?? 'Invalid value';
    }
}

export function InputError(props: Readonly<Props>): JSX.Element {
    return (
        <>
            {props.error && (
                <div>
                    <TextComponent
                        elementType="small"
                        semanticColor="textNegative"
                    >
                        {getErrorMessage(props.error)}
                    </TextComponent>
                </div>
            )}
        </>
    );
}
