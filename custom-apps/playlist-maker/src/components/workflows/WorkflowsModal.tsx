import React, { useEffect } from 'react';
import styles from './WorkflowsModal.module.scss';
import { getWorkflowsFromStorage } from '../../utils/storage-utils';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { Import, Trash } from 'lucide-react';
import useAppStore, { type AppState } from '../../stores/store';
import { useShallow } from 'zustand/react/shallow';
import useDialogStore, { type DialogState } from '../../stores/dialog-store';

export function WorkflowsModal(): JSX.Element {
    const {
        hasPendingChanges,
        loadWorkflow,
    }: Pick<AppState, 'hasPendingChanges' | 'loadWorkflow'> = useAppStore(
        useShallow((state) => ({
            hasPendingChanges: state.hasPendingChanges,
            loadWorkflow: state.loadWorkflow,
        })),
    );

    const {
        setShowConfirmLoadModal,
        setShowConfirmDeleteModal,
        setSelectedWorkflow,
        savedWorkflows,
        setSavedWorkflows,
    }: Pick<
        DialogState,
        | 'setShowConfirmLoadModal'
        | 'setShowConfirmDeleteModal'
        | 'setSelectedWorkflow'
        | 'savedWorkflows'
        | 'setSavedWorkflows'
    > = useDialogStore(
        useShallow((state) => {
            return {
                setShowConfirmLoadModal: state.setShowConfirmLoadModal,
                setShowConfirmDeleteModal: state.setShowConfirmDeleteModal,
                setSelectedWorkflow: state.setSelectedWorkflow,
                savedWorkflows: state.savedWorkflows,
                setSavedWorkflows: state.setSavedWorkflows,
            };
        }),
    );

    useEffect(() => {
        setSavedWorkflows(getWorkflowsFromStorage());
    }, [setSavedWorkflows]);

    return (
        <>
            {savedWorkflows.length === 0 && (
                <TextComponent elementType="small" semanticColor="textSubdued">
                    No saved workflows
                </TextComponent>
            )}
            {savedWorkflows.map((workflow) => {
                return (
                    <div key={workflow.id} className={styles['workflow']}>
                        <TextComponent>{workflow.name}</TextComponent>
                        <div>
                            <Spicetify.ReactComponent.TooltipWrapper label="Load workflow">
                                <Spicetify.ReactComponent.ButtonTertiary
                                    aria-label="Load workflow"
                                    onClick={() => {
                                        setSelectedWorkflow(workflow);
                                        if (hasPendingChanges) {
                                            setShowConfirmLoadModal(true);
                                        } else {
                                            loadWorkflow(workflow);
                                            Spicetify.PopupModal.hide();
                                        }
                                    }}
                                    buttonSize="sm"
                                    iconOnly={() => <Import size={20} />}
                                />
                            </Spicetify.ReactComponent.TooltipWrapper>
                            <Spicetify.ReactComponent.TooltipWrapper label="Delete workflow">
                                <Spicetify.ReactComponent.ButtonTertiary
                                    aria-label="Delete workflow"
                                    onClick={() => {
                                        setSelectedWorkflow(workflow);
                                        setShowConfirmDeleteModal(true);
                                    }}
                                    buttonSize="sm"
                                    iconOnly={() => (
                                        <Trash
                                            size={20}
                                            color="var(--spice-notification-error)"
                                        />
                                    )}
                                />
                            </Spicetify.ReactComponent.TooltipWrapper>
                        </div>
                    </div>
                );
            })}
        </>
    );
}
