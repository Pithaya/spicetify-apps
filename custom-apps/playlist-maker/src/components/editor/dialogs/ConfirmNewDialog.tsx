import useDialogStore, {
    type DialogState,
} from 'custom-apps/playlist-maker/src/store/dialog-store';
import useAppStore, {
    type AppState,
} from 'custom-apps/playlist-maker/src/store/store';
import React from 'react';
import { useShallow } from 'zustand/react/shallow';

export function ConfirmNewDialog(): JSX.Element {
    const { resetState }: Pick<AppState, 'resetState'> = useAppStore(
        useShallow((state) => ({ resetState: state.resetState })),
    );

    const {
        showConfirmNewModal,
        setShowConfirmNewModal,
    }: Pick<DialogState, 'showConfirmNewModal' | 'setShowConfirmNewModal'> =
        useDialogStore(
            useShallow((state) => {
                return {
                    showConfirmNewModal: state.showConfirmNewModal,
                    setShowConfirmNewModal: state.setShowConfirmNewModal,
                };
            }),
        );

    return (
        <Spicetify.ReactComponent.ConfirmDialog
            style={{ zIndex: 200 }}
            isOpen={showConfirmNewModal}
            onConfirm={() => {
                setShowConfirmNewModal(false);
                resetState();
            }}
            onClose={() => {
                setShowConfirmNewModal(false);
            }}
            onOutside={() => {
                setShowConfirmNewModal(false);
            }}
            titleText="Create new workflow"
            descriptionText="You have unsaved changes that will be lost. Confirm?"
            confirmText="Confirm"
            cancelText="Cancel"
        />
    );
}
