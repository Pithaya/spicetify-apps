import type { ReactFlowJsonObject } from 'reactflow';

const APP_KEY = 'playlist-maker';
const WORKFLOW_KEY = `${APP_KEY}:workflows`;

export type SavedWorkflow = ReactFlowJsonObject & {
    id: string;
    name: string;
};

export function saveWorkflowToStorage(workflow: SavedWorkflow): void {
    const workflows: SavedWorkflow[] = getWorkflowsFromStorage();

    // Remove the workflow if it already exists
    const filteredWorkflows = workflows.filter((w) => w.id !== workflow.id);

    Spicetify.LocalStorage.set(
        WORKFLOW_KEY,
        JSON.stringify([...filteredWorkflows, workflow]),
    );
}

export function removeWorkflowFromStorage(id: string): void {
    const workflows: SavedWorkflow[] = getWorkflowsFromStorage();

    const filteredWorkflows = workflows.filter((w) => w.id !== id);

    Spicetify.LocalStorage.set(WORKFLOW_KEY, JSON.stringify(filteredWorkflows));
}

export function getWorkflowsFromStorage(): SavedWorkflow[] {
    return JSON.parse(Spicetify.LocalStorage.get(WORKFLOW_KEY) ?? '[]');
}
