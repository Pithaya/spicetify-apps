import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect } from 'react';
import {
    type Control,
    type DefaultValues,
    type FieldErrors,
    type FieldValues,
    type UseFormGetValues,
    type UseFormSetError,
    useForm,
} from 'react-hook-form';
import type { z } from 'zod';
import { useShallow } from 'zustand/react/shallow';
import useAppStore from '../stores/store';

export function useNodeForm<TForm extends FieldValues>(
    nodeId: string,
    nodeData: TForm,
    defaultValues: DefaultValues<TForm>,
    schema: z.Schema<any, any>,
): {
    errors: FieldErrors<TForm>;
    getValues: UseFormGetValues<TForm>;
    control: Control<TForm, any>;
    setError: UseFormSetError<TForm>;
    updateNodeField: (field: Partial<TForm>) => void;
} {
    const {
        updateNodeData,
        anyExecuting,
        addValidationCallback,
        removeValidationCallback,
    } = useAppStore(
        useShallow((state) => {
            return {
                updateNodeData: state.updateNodeData,
                anyExecuting: state.anyExecuting,
                addValidationCallback: state.addValidationCallback,
                removeValidationCallback: state.removeValidationCallback,
            };
        }),
    );

    const updateNodeField = useCallback(
        (field: Partial<TForm>): void => {
            updateNodeData<TForm>(nodeId, field);
        },
        [nodeId, updateNodeData],
    );

    const {
        formState: { errors },
        trigger,
        control,
        getValues,
        setError,
    } = useForm<TForm>({
        mode: 'onChange',
        disabled: anyExecuting,
        defaultValues,
        values: nodeData,
        resolver: zodResolver(schema),
    });

    // Save this node's trigger function in the store
    // So that the store can trigger validation for this node
    useEffect(() => {
        addValidationCallback(nodeId, async () => {
            return await trigger();
        });

        return () => {
            removeValidationCallback(nodeId);
        };
    }, [nodeId, addValidationCallback, removeValidationCallback, trigger]);

    return {
        errors,
        getValues,
        control,
        setError,
        updateNodeField,
    };
}
