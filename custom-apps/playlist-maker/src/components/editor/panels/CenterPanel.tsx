import { zodResolver } from '@hookform/resolvers/zod';
import useDialogStore from 'custom-apps/playlist-maker/src/stores/dialog-store';
import useAppStore, {
    type AppState,
} from 'custom-apps/playlist-maker/src/stores/store';
import { saveWorkflowToStorage } from 'custom-apps/playlist-maker/src/utils/storage-utils';
import { CirclePlus, Network, Save } from 'lucide-react';
import React, { useCallback, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Panel } from 'reactflow';
import { z } from 'zod';
import { useShallow } from 'zustand/react/shallow';
import { InputError } from '../../inputs/InputError';
import { TextController } from '../../inputs/TextController';
import { WorkflowsModal } from '../../workflows/WorkflowsModal';

const FormSchema = z.object({
    workflowName: z.string().nonempty({ message: 'Name cannot be empty' }),
});

type Form = z.infer<typeof FormSchema>;

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
        formState: { errors, isValid },
        control,
        getValues,
        setValue,
    } = useForm<Form>({
        mode: 'onChange',
        disabled: anyExecuting,
        defaultValues: {
            workflowName,
        },
        resolver: zodResolver(FormSchema),
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
        <Panel className="flex items-center rounded-lg" position="top-center">
            <div className="flex-col ps-1">
                <div className="flex items-center">
                    <TextController
                        placeholder=""
                        control={control}
                        name="workflowName"
                        required
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
                <InputError error={errors.workflowName} />
            </div>

            <div className="mx-1 self-stretch border-l border-solid border-(--text-subdued)" />

            <Spicetify.ReactComponent.TooltipWrapper label="Manage workflows">
                <Spicetify.ReactComponent.ButtonTertiary
                    aria-label="Manage workflows"
                    onClick={() => {
                        Spicetify.PopupModal.display({
                            title: 'Saved workflows',
                            content: React.createElement(WorkflowsModal),
                            isLarge: false,
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
                    iconOnly={() => <CirclePlus size={20} />}
                />
            </Spicetify.ReactComponent.TooltipWrapper>
        </Panel>
    );
}
