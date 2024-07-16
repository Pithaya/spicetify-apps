import type { ReactFlowJsonObject } from 'reactflow';

const APP_KEY = 'playlist-maker';
const WORKFLOW_KEY = `${APP_KEY}:workflows`;
const ARTIST_GENRES_KEY = `${APP_KEY}:artist-genres`;

export type ItemWithExpiry<T> = {
    value: T;
    expiry: number;
};

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

export function setArtistsGenresCache(
    artistsGenres: Map<string, ItemWithExpiry<string[]>>,
): void {
    Spicetify.LocalStorage.set(
        ARTIST_GENRES_KEY,
        JSON.stringify(Array.from(artistsGenres)),
    );
}

export function getArtistsGenresCache(): Map<string, ItemWithExpiry<string[]>> {
    const cache = JSON.parse(
        Spicetify.LocalStorage.get(ARTIST_GENRES_KEY) ?? '[]',
    );

    return new Map(cache);
}

export function removeExpired<T>(
    map: Map<string, ItemWithExpiry<T>>,
): Map<string, ItemWithExpiry<T>> {
    const now = new Date();

    for (const [key, value] of map.entries()) {
        if (value.expiry < now.getTime()) {
            map.delete(key);
        }
    }

    return map;
}

export function createWithExpiry<T>(value: T, ttl: number): ItemWithExpiry<T> {
    return {
        value,
        expiry: new Date().getTime() + ttl,
    };
}
