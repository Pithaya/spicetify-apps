import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { useLiveQuery } from 'dexie-react-hooks';
import { Import, Trash } from 'lucide-react';
import React from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useShallow } from 'zustand/react/shallow';
import type { SavedWorkflowMetadata } from '../../db/workflows/saved-workflow';
import { getAllSorted, getWorkflow } from '../../db/workflows/workflow-db';
import useDialogStore, { type DialogState } from '../../stores/dialog-store';
import useAppStore, { type AppState } from '../../stores/store';

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
    }: Pick<
        DialogState,
        | 'setShowConfirmLoadModal'
        | 'setShowConfirmDeleteModal'
        | 'setSelectedWorkflow'
    > = useDialogStore(
        useShallow((state) => {
            return {
                setShowConfirmLoadModal: state.setShowConfirmLoadModal,
                setShowConfirmDeleteModal: state.setShowConfirmDeleteModal,
                setSelectedWorkflow: state.setSelectedWorkflow,
            };
        }),
    );

    const [search, setSearch] = React.useState<string>('');
    const [debouncedSearch, setDebouncedSearch] = React.useState<string>('');

    const debouncedSearchCallback = useDebouncedCallback((value: string) => {
        setDebouncedSearch(value);
    }, 200);

    const onSearchChanged = (value: string): void => {
        setSearch(value);
        debouncedSearchCallback(value);
    };

    const savedWorkflows = useLiveQuery(
        async () => await getAllSorted(debouncedSearch),
        [debouncedSearch],
        [],
    );

    const onDeleteWorkflow = (workflow: SavedWorkflowMetadata) => {
        setSelectedWorkflow(workflow);
        setShowConfirmDeleteModal(true);
    };

    const onLoadWorkflow = async (workflow: SavedWorkflowMetadata) => {
        setSelectedWorkflow(workflow);

        if (hasPendingChanges) {
            setShowConfirmLoadModal(true);
        } else {
            const workflowToLoad = await getWorkflow(workflow.id);

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
        }
    };

    return (
        <>
            <input
                type="text"
                placeholder="Search"
                className="tw:mb-4 tw:w-full tw:rounded tw:border tw:border-solid tw:border-(--essential-subdued) tw:px-2 tw:py-1 tw:focus:border-(--essential-base)"
                value={search}
                onChange={(e) => {
                    onSearchChanged(e.target.value);
                }}
            />
            {savedWorkflows.length === 0 && (
                <TextComponent elementType="small" semanticColor="textSubdued">
                    No workflows
                </TextComponent>
            )}
            {savedWorkflows.map((workflow, index) => {
                return (
                    <>
                        <div
                            key={workflow.id}
                            className="tw:flex tw:flex-row tw:items-center tw:justify-between"
                        >
                            <div className="tw:flex tw:flex-col tw:gap-1">
                                <TextComponent>{workflow.name}</TextComponent>
                                <TextComponent
                                    fontSize="small"
                                    semanticColor="textSubdued"
                                >
                                    Last updated:{' '}
                                    {Spicetify.Locale.formatDate(
                                        workflow.lastUpdated,
                                    )}
                                </TextComponent>
                            </div>
                            <div>
                                <Spicetify.ReactComponent.TooltipWrapper label="Load workflow">
                                    <Spicetify.ReactComponent.ButtonTertiary
                                        aria-label="Load workflow"
                                        onClick={async () => {
                                            await onLoadWorkflow(workflow);
                                        }}
                                        buttonSize="sm"
                                        iconOnly={() => <Import size={20} />}
                                    />
                                </Spicetify.ReactComponent.TooltipWrapper>
                                <Spicetify.ReactComponent.TooltipWrapper label="Delete workflow">
                                    <Spicetify.ReactComponent.ButtonTertiary
                                        aria-label="Delete workflow"
                                        onClick={() => {
                                            onDeleteWorkflow(workflow);
                                        }}
                                        buttonSize="sm"
                                        iconOnly={() => (
                                            <Trash
                                                size={20}
                                                className="tw:text-spice-error"
                                            />
                                        )}
                                    />
                                </Spicetify.ReactComponent.TooltipWrapper>
                            </div>
                        </div>
                        {index < savedWorkflows.length - 1 && (
                            <hr className="tw:my-2 tw:divide-solid tw:opacity-20" />
                        )}
                    </>
                );
            })}
        </>
    );
}
