import { create } from 'zustand';
import type { SavedWorkflow } from '../utils/storage-utils';

export type DialogState = {
    showConfirmNewModal: boolean;
    showConfirmLoadModal: boolean;
    selectedWorkflow: SavedWorkflow | null;
    setShowConfirmNewModal: (show: boolean) => void;
    setShowConfirmLoadModal: (show: boolean) => void;
    setSelectedWorkflow: (workflow: SavedWorkflow | null) => void;
};

export const useDialogStore = create<DialogState>((set, get) => ({
    showConfirmNewModal: false,
    showConfirmLoadModal: false,
    selectedWorkflow: null,
    setShowConfirmNewModal: (show) => {
        set({ showConfirmNewModal: show });
    },
    setShowConfirmLoadModal: (show) => {
        set({ showConfirmLoadModal: show });
    },
    setSelectedWorkflow: (workflow) => {
        set({ selectedWorkflow: workflow });
    },
}));

export default useDialogStore;
