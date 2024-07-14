import React from 'react';
import styles from './WorkflowsModal.module.scss';
import { getWorkflowsFromStorage } from '../../utils/storage-utils';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { Import, Trash } from 'lucide-react';
import useAppStore, { type AppState } from '../../store/store';
import { useShallow } from 'zustand/react/shallow';
import useDialogStore, { type DialogState } from '../../store/dialog-store';

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
        setSelectedWorkflow,
    }: Pick<DialogState, 'setShowConfirmLoadModal' | 'setSelectedWorkflow'> =
        useDialogStore(
            useShallow((state) => {
                return {
                    setShowConfirmLoadModal: state.setShowConfirmLoadModal,
                    setSelectedWorkflow: state.setSelectedWorkflow,
                };
            }),
        );
    const workflows = getWorkflowsFromStorage();

    return (
        <>
            {workflows.map((workflow) => {
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
                                        // TODO: Show confirm delete modal
                                        setSelectedWorkflow(workflow);
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
