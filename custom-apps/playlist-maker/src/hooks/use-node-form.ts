import { useShallow } from 'zustand/react/shallow';
import useAppStore from '../stores/store';
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
import { useEffect } from 'react';
import { type BaseNodeData } from '../models/nodes/node-processor';

type LocalNodeData<TNodeData extends BaseNodeData> = Omit<
    TNodeData,
    'isExecuting'
>;

export function useNodeForm<TNodeData extends BaseNodeData & FieldValues>(
    nodeId: string,
    defaultValues: DefaultValues<LocalNodeData<TNodeData>>,
): {
    register: UseFormRegister<LocalNodeData<TNodeData>>;
    errors: FieldErrors<LocalNodeData<TNodeData>>;
    setValue: UseFormSetValue<LocalNodeData<TNodeData>>;
    getValues: UseFormGetValues<LocalNodeData<TNodeData>>;
    control: Control<LocalNodeData<TNodeData>, any>;
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
        setValue,
        getValues,
    } = useForm<LocalNodeData<TNodeData>>({
        mode: 'onChange',
        disabled: anyExecuting,
        defaultValues,
    });

    const formValues = useWatch({ control });

    useEffect(() => {
        updateNodeData<LocalNodeData<TNodeData>>(nodeId, formValues);
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
    };
}
