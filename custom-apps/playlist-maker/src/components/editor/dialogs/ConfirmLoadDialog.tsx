import { getWorkflow } from 'custom-apps/playlist-maker/src/db/workflows/workflow-db';
import useDialogStore, {
    type DialogState,
} from 'custom-apps/playlist-maker/src/stores/dialog-store';
import useAppStore, {
    type AppState,
} from 'custom-apps/playlist-maker/src/stores/store';
import React from 'react';
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
            className="tw:z-[200]"
            isOpen={showConfirmLoadModal}
            onConfirm={async () => {
                setShowConfirmLoadModal(false);

                if (selectedWorkflow === null) {
                    Spicetify.showNotification(
                        'Failed to load workflow',
                        true,
                        2000,
                    );
                    return;
                }

                const workflowToLoad = await getWorkflow(selectedWorkflow.id);

                if (workflowToLoad === undefined) {
                    Spicetify.showNotification(
                        'Failed to load workflow',
                        true,
                        2000,
                    );
                    return;
                }

                loadWorkflow(workflowToLoad);
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
