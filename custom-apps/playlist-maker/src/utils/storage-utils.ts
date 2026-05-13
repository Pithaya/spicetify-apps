import Dexie from 'dexie';
import type { SavedWorkflow } from '../db/workflows/saved-workflow';
import { insertLegacyWorkflows } from '../db/workflows/workflow-db';

// Legacy storage system
// TODO: Remove this in a future version

const APP_KEY = 'playlist-maker';
const WORKFLOW_KEY = `${APP_KEY}:workflows`;
const ARTIST_GENRES_KEY = `${APP_KEY}:artist-genres`;

export type SavedLegacyWorkflow = Omit<SavedWorkflow, 'lastUpdated'>;

export function getWorkflowsFromStorage(): SavedLegacyWorkflow[] {
    return JSON.parse(
        Spicetify.LocalStorage.get(WORKFLOW_KEY) ?? '[]',
    ) as SavedLegacyWorkflow[];
}

export async function migrateLegacyWorkflows(): Promise<void> {
    // Save existing workflows in indexedDB
    const workflows = getWorkflowsFromStorage();

    if (workflows.length === 0) {
        return;
    }

    await insertLegacyWorkflows(workflows);

    // Clear legacy storage
    Spicetify.LocalStorage.remove(WORKFLOW_KEY);
}

export function deleteLegacyArtistGenres(): void {
    Spicetify.LocalStorage.remove(ARTIST_GENRES_KEY);
}

export async function deleteLegacyArtistGenresDb(): Promise<void> {
    deleteLegacyArtistGenres();
    await Dexie.delete(ARTIST_GENRES_KEY);
}
