import { zodResolver } from '@hookform/resolvers/zod';
import deepEqual from 'deep-equal';
import { useEffect } from 'react';
import {
    type Control,
    type DefaultValues,
    type FieldErrors,
    type FieldValues,
    type UseFormGetValues,
    type UseFormRegister,
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
        reset,
        getValues,
        setValue,
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
        if (Object.keys(nodeData).length === 0) {
            // If nodeData is empty, default values are not yet set
            return;
        }

        // If we load a new workflow with the same nodes, the nodes component won't be recreated
        // So when data has changed outside of the form, sync the form
        // undefined values are not stored, so we apply the default values
        const areEquals = deepEqual(
            { ...defaultValues, ...nodeData },
            getValues(),
            { strict: true },
        );

        if (!areEquals) {
            reset(nodeData);
        }
    }, [nodeData, defaultValues, getValues, reset]);

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
    };
}
