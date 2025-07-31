/**
 * State of the driver after the process callback has finished.
 */
export type DriverState = {
    /**
     * Number of beats that have played so far.
     */
    beatsPlayed: number;
    /**
     * Current chance to follow a branch.
     */
    currentRandomBranchChance: number;
    /**
     * Current listen time.
     */
    listenTime: number;
    /**
     * The beat(s) that are currently playing.
     */
    playingBeats: Set<number>;
    /**
     * The branch that is currently playing (if we are branching).
     */
    playingBranch: string | undefined;
    /**
     * Beats that have previously been played.
     */
    playedBeats: Map<number, number>;
};
