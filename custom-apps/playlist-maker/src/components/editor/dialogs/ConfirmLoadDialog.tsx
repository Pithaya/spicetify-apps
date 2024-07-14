import React from 'react';
import useDialogStore, {
    type DialogState,
} from 'custom-apps/playlist-maker/src/store/dialog-store';
import useAppStore, {
    type AppState,
} from 'custom-apps/playlist-maker/src/store/store';
import { useShallow } from 'zustand/react/shallow';

export function ConfirmLoadDialog(): JSX.Element {
    const { loadWorkflow }: Pick<AppState, 'loadWorkflow'> = useAppStore(
        useShallow((state) => ({ loadWorkflow: state.loadWorkflow })),
    );

    const {
        showConfirmLoadModal,
        setShowConfirmLoadModal,
        selectedWorkflow,
    }: Pick<
        DialogState,
        'showConfirmLoadModal' | 'setShowConfirmLoadModal' | 'selectedWorkflow'
    > = useDialogStore(
        useShallow((state) => {
            return {
                showConfirmLoadModal: state.showConfirmLoadModal,
                setShowConfirmLoadModal: state.setShowConfirmLoadModal,
                selectedWorkflow: state.selectedWorkflow,
            };
        }),
    );

    return (
        <Spicetify.ReactComponent.ConfirmDialog
            style={{ zIndex: 200 }}
            isOpen={showConfirmLoadModal}
            onConfirm={() => {
                setShowConfirmLoadModal(false);
                if (selectedWorkflow !== null) {
                    loadWorkflow(selectedWorkflow);
                }
                Spicetify.PopupModal.hide();
            }}
            onClose={() => {
                setShowConfirmLoadModal(false);
            }}
            onOutside={() => {
                setShowConfirmLoadModal(false);
            }}
            titleText="Load workflow"
            descriptionText="You have unsaved changes that will be lost. Confirm?"
            confirmText="Confirm"
            cancelText="Cancel"
        />
    );
}
