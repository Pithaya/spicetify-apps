/**
 * Jukebox settings.
 */
export type JukeboxSettings = {
    /**
     * Current allowed maximum distance for a branch.
     */
    maxBranchDistance: number;

    /**
     * If true, will ignore the `branchDistance` and dynamically calculate it.
     */
    useDynamicBranchDistance: boolean;

    /**
     * Minimum chance to follow a branch.
     */
    minRandomBranchChance: number;

    /**
     * Maximum chance to follow a branch.
     */
    maxRandomBranchChance: number;

    /**
     * How much the chance to follow a branch should increase every beat.
     */
    randomBranchChanceDelta: number;

    /**
     * Maximum play time before disabling the jukebox.
     */
    maxJukeboxPlayTime: number;

    /**
     * If true, optimize by adding a good last edge.
     */
    addLastEdge: boolean;

    /**
     * If true, only add backward branches.
     */
    justBackwards: boolean;

    /**
     * If true, only add long branches.
     */
    justLongBranches: boolean;

    /**
     * If true, remove consecutive branches of the same distance.
     */
    removeSequentialBranches: boolean;

    /**
     * If true, always branch at the last possible point.
     */
    alwaysFollowLastBranch: boolean;
};
