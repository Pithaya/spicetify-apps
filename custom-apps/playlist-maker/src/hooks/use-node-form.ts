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
import {
    type LocalNodeData,
    type BaseNodeData,
} from '../models/nodes/node-processor';
import deepEqual from 'deep-equal';

export function useNodeForm<TNodeData extends BaseNodeData & FieldValues>(
    nodeId: string,
    nodeData: TNodeData,
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
        reset,
        getValues,
        setValue,
    } = useForm<LocalNodeData<TNodeData>>({
        mode: 'onChange',
        disabled: anyExecuting,
        defaultValues: {
            ...defaultValues,
            ...nodeData,
        },
    });

    const formValues = useWatch({ control });

    useEffect(() => {
        updateNodeData<LocalNodeData<TNodeData>>(nodeId, formValues);
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
