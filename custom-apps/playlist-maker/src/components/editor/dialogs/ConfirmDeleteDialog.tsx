import useDialogStore, {
    type DialogState,
} from 'custom-apps/playlist-maker/src/store/dialog-store';
import {
    getWorkflowsFromStorage,
    removeWorkflowFromStorage,
} from 'custom-apps/playlist-maker/src/utils/storage-utils';
import React from 'react';
import { useShallow } from 'zustand/react/shallow';

export function ConfirmDeleteDialog(): JSX.Element {
    const {
        showConfirmDeleteModal,
        setShowConfirmDeleteModal,
        selectedWorkflow,
        setSavedWorkflows,
    }: Pick<
        DialogState,
        | 'showConfirmDeleteModal'
        | 'setShowConfirmDeleteModal'
        | 'selectedWorkflow'
        | 'setSavedWorkflows'
    > = useDialogStore(
        useShallow((state) => {
            return {
                showConfirmDeleteModal: state.showConfirmDeleteModal,
                setShowConfirmDeleteModal: state.setShowConfirmDeleteModal,
                selectedWorkflow: state.selectedWorkflow,
                setSavedWorkflows: state.setSavedWorkflows,
            };
        }),
    );

    return (
        <Spicetify.ReactComponent.ConfirmDialog
            isOpen={showConfirmDeleteModal}
            onConfirm={() => {
                setShowConfirmDeleteModal(false);
                if (selectedWorkflow !== null) {
                    removeWorkflowFromStorage(selectedWorkflow?.id);
                    setSavedWorkflows(getWorkflowsFromStorage());
                }
            }}
            onClose={() => {
                setShowConfirmDeleteModal(false);
            }}
            onOutside={() => {
                setShowConfirmDeleteModal(false);
            }}
            titleText="Delete workflow"
            descriptionText={`Are you sure you want to delete the workflow "${selectedWorkflow?.name}" ?`}
            confirmText="Confirm"
            cancelText="Cancel"
        />
    );
}
