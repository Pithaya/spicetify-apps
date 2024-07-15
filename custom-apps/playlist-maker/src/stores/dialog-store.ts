import { create } from 'zustand';
import type { SavedWorkflow } from '../utils/storage-utils';

export type DialogState = {
    showConfirmNewModal: boolean;
    showConfirmLoadModal: boolean;
    showConfirmDeleteModal: boolean;
    selectedWorkflow: SavedWorkflow | null;
    savedWorkflows: SavedWorkflow[];
    setShowConfirmNewModal: (show: boolean) => void;
    setShowConfirmLoadModal: (show: boolean) => void;
    setShowConfirmDeleteModal: (show: boolean) => void;
    setSelectedWorkflow: (workflow: SavedWorkflow | null) => void;
    setSavedWorkflows: (workflows: SavedWorkflow[]) => void;
};

export const useDialogStore = create<DialogState>((set, get) => ({
    showConfirmNewModal: false,
    showConfirmLoadModal: false,
    showConfirmDeleteModal: false,
    selectedWorkflow: null,
    savedWorkflows: [],
    setShowConfirmNewModal: (show) => {
        set({ showConfirmNewModal: show });
    },
    setShowConfirmLoadModal: (show) => {
        set({ showConfirmLoadModal: show });
    },
    setShowConfirmDeleteModal: (show) => {
        set({ showConfirmDeleteModal: show });
    },
    setSelectedWorkflow: (workflow) => {
        set({ selectedWorkflow: workflow });
    },
    setSavedWorkflows: (workflows) => {
        set({ savedWorkflows: workflows });
    },
}));

export default useDialogStore;
