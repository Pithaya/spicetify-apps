import React, { useCallback, useEffect } from 'react';
import styles from './CenterPanel.module.scss';
import { Panel } from 'reactflow';
import { TextInput } from '../../inputs/TextInput';
import useAppStore, {
    type AppState,
} from 'custom-apps/playlist-maker/src/stores/store';
import { useShallow } from 'zustand/react/shallow';
import { WorkflowsModal } from '../../workflows/WorkflowsModal';
import { BadgePlus, Network, Save } from 'lucide-react';
import { saveWorkflowToStorage } from 'custom-apps/playlist-maker/src/utils/storage-utils';
import useDialogStore from 'custom-apps/playlist-maker/src/stores/dialog-store';
import { InputError } from '../../inputs/InputError';
import { useForm, useWatch } from 'react-hook-form';
import { stringValueSetter } from 'custom-apps/playlist-maker/src/utils/form-utils';

export function CenterPanel(): JSX.Element {
    const {
        workflowName,
        setWorkflowName,
        hasPendingChanges,
        reactFlowInstance,
        workflowId,
        onWorkflowSaved,
        resetState,
        anyExecuting,
    }: Pick<
        AppState,
        | 'workflowName'
        | 'setWorkflowName'
        | 'hasPendingChanges'
        | 'reactFlowInstance'
        | 'workflowId'
        | 'onWorkflowSaved'
        | 'resetState'
        | 'anyExecuting'
    > = useAppStore(
        useShallow((state) => ({
            workflowName: state.workflowName,
            setWorkflowName: state.setWorkflowName,
            hasPendingChanges: state.hasPendingChanges,
            reactFlowInstance: state.reactFlowInstance,
            workflowId: state.workflowId,
            onWorkflowSaved: state.onWorkflowSaved,
            resetState: state.resetState,
            anyExecuting: state.anyExecuting,
        })),
    );

    const {
        register,
        formState: { errors, isValid },
        control,
        getValues,
        setValue,
    } = useForm<{ workflowName: string | undefined }>({
        mode: 'onChange',
        disabled: anyExecuting,
        defaultValues: {
            workflowName,
        },
    });

    const formValues = useWatch({ control });

    useEffect(() => {
        setWorkflowName(formValues.workflowName ?? '');
    }, [formValues, setWorkflowName]);

    useEffect(() => {
        // On changes outside of the form (workflow load, reset), sync the state
        if (getValues('workflowName') !== workflowName) {
            setValue('workflowName', workflowName, { shouldValidate: true });
        }
    }, [workflowName, getValues, setValue]);

    const { setShowConfirmNewModal } = useDialogStore(
        useShallow((state) => ({
            setShowConfirmNewModal: state.setShowConfirmNewModal,
        })),
    );

    const saveWorkflow = useCallback(() => {
        if (reactFlowInstance === null) {
            return;
        }

        const flow = reactFlowInstance.toObject();
        saveWorkflowToStorage({
            ...flow,
            id: workflowId,
            name: workflowName,
        });
        onWorkflowSaved();
        Spicetify.showNotification('Workflow saved', false, 1000);
    }, [reactFlowInstance, onWorkflowSaved, workflowId, workflowName]);

    const resetWorkflow = useCallback(() => {
        if (hasPendingChanges) {
            setShowConfirmNewModal(true);
        } else {
            resetState();
        }
    }, [hasPendingChanges, resetState, setShowConfirmNewModal]);

    return (
        <Panel
            className={styles['panel'] + ' ' + styles['flex-row']}
            position="top-center"
        >
            <div>
                <div className={styles['flex-row']}>
                    <TextInput
                        className={styles['title-input']}
                        placeholder=""
                        {...register('workflowName', {
                            required: true,
                            setValueAs: stringValueSetter,
                        })}
                    />
                    <Spicetify.ReactComponent.TooltipWrapper label="Save workflow">
                        <Spicetify.ReactComponent.ButtonTertiary
                            aria-label="Save workflow"
                            disabled={!hasPendingChanges || !isValid}
                            onClick={() => {
                                saveWorkflow();
                            }}
                            buttonSize="sm"
                            iconOnly={() => <Save size={20} />}
                        />
                    </Spicetify.ReactComponent.TooltipWrapper>
                </div>
                <div className={styles['title-input']}>
                    <InputError error={errors.workflowName} />
                </div>
            </div>

            <div className={styles['divider-vertical']} />

            <Spicetify.ReactComponent.TooltipWrapper label="Manage workflows">
                <Spicetify.ReactComponent.ButtonTertiary
                    aria-label="Manage workflows"
                    onClick={() => {
                        Spicetify.PopupModal.display({
                            title: 'Saved workflows',
                            content: React.createElement(WorkflowsModal) as any,
                            isLarge: true,
                        });
                    }}
                    buttonSize="sm"
                    iconOnly={() => <Network size={20} />}
                />
            </Spicetify.ReactComponent.TooltipWrapper>
            <Spicetify.ReactComponent.TooltipWrapper label="Create new">
                <Spicetify.ReactComponent.ButtonTertiary
                    aria-label="Create new"
                    onClick={() => {
                        resetWorkflow();
                    }}
                    buttonSize="sm"
                    iconOnly={() => <BadgePlus size={20} />}
                />
            </Spicetify.ReactComponent.TooltipWrapper>
        </Panel>
    );
}
