import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import {
    type Control,
    type DefaultValues,
    type FieldErrors,
    type FieldValues,
    type UseFormGetValues,
    type UseFormRegister,
    type UseFormSetError,
    type UseFormSetValue,
    useForm,
    useWatch,
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
    register: UseFormRegister<TForm>;
    errors: FieldErrors<TForm>;
    setValue: UseFormSetValue<TForm>;
    getValues: UseFormGetValues<TForm>;
    control: Control<TForm, any>;
    setError: UseFormSetError<TForm>;
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

    const {
        register,
        formState: { errors },
        trigger,
        control,
        getValues,
        setValue,
        setError,
    } = useForm<TForm>({
        mode: 'onChange',
        disabled: anyExecuting,
        defaultValues: {
            ...defaultValues,
            ...nodeData,
        },
        resolver: zodResolver(schema),
    });

    const formValues = useWatch({ control });

    useEffect(() => {
        updateNodeData<TForm>(nodeId, formValues);
    }, [nodeId, updateNodeData, formValues]);

    useEffect(() => {
        addValidationCallback(nodeId, async () => {
            return await trigger();
        });

        return () => {
            removeValidationCallback(nodeId);
        };
    }, [nodeId, addValidationCallback, removeValidationCallback, trigger]);

    return {
        register,
        errors,
        setValue,
        getValues,
        control,
        setError,
    };
}
