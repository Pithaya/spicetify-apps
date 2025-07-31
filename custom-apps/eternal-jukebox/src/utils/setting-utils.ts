import { type JukeboxSettings } from '../models/jukebox-settings';

const SETTING_ID: string = 'jukebox:settings';

/**
 * Minimum number of beats to play before we are allowed to branch.
 */
export const MIN_BEATS_BEFORE_BRANCHING: number = 5;

/**
 * Minimum distance allowed for a branch.
 */
export const RANGE_MIN_BRANCH_DISTANCE: number = 2;

/**
 * Maximum distance allowed for a branch.
 */
export const RANGE_MAX_BRANCH_DISTANCE: number = 80;

/**
 * Minimum branch chance delta.
 */
export const MIN_RANDOM_BRANCH_CHANCE_DELTA: number = 0.0;

/**
 * Minimum branch chance delta.
 */
export const MAX_RANDOM_BRANCH_CHANCE_DELTA: number = 0.2;

/**
 * Default setting values.
 */
export const DEFAULT_SETTINGS: Readonly<JukeboxSettings> = {
    maxBranchDistance: 30,
    useDynamicBranchDistance: false,
    minRandomBranchChance: 0.18,
    maxRandomBranchChance: 0.5,
    randomBranchChanceDelta: 0.018,
    maxJukeboxPlayTime: 0,
    addLastEdge: true,
    justBackwards: false,
    justLongBranches: false,
    removeSequentialBranches: false,
    alwaysFollowLastBranch: true,
};

export function getSettingsFromStorage(): JukeboxSettings {
    const storageValue = Spicetify.LocalStorage.get(SETTING_ID);

    if (storageValue === null) {
        return { ...DEFAULT_SETTINGS };
    }

    return JSON.parse(storageValue) as JukeboxSettings;
}

export function saveSettingsToStorage(settings: JukeboxSettings): void {
    Spicetify.LocalStorage.set(SETTING_ID, JSON.stringify(settings));
}
