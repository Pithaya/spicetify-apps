import { getPlatform } from '@shared/utils/spicetify-utils';
import type { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { type DriverState } from './models/driver-state';
import type { Beat } from './models/graph/beat';
import type { Edge } from './models/graph/edge';
import { type JukeboxSettings } from './models/jukebox-settings';
import type { JukeboxSongState } from './models/jukebox-song-state';
import { MIN_BEATS_BEFORE_BRANCHING } from './utils/setting-utils';

// Used to print debug messages.
const DEBUG = true;

/**
 * The result of the next beat calculation.
 */
type NextBeatResult = {
    /**
     * The next beat to play.
     */
    nextBeat: Beat | null;
    /**
     * The branch that will be followed (if branching).
     */
    branch?: Edge;
};

/**
 * Handles playing the song.
 */
export class Driver {
    /**
     * The beat that's currently playing.
     */
    private currentBeat: Beat | null = null;

    /**
     * If true, the song will bounce between tiles linked by an edge.
     */
    private bouncing: boolean = false;

    /**
     * Source beat for the bounce.
     */
    private bounceSeed: Beat | null = null;

    /**
     * How long we've bounced.
     */
    private bounceCount = 0;

    /**
     * If true, we are currently seeking to a new beat.
     */
    private isSeeking: boolean = false;

    /**
     * How many beats passed since we last branched.
     * Used to avoid following branches too fast.
     */
    private beatsSinceLastBranch: number = 0;

    /**
     * Total number of beats played.
     */
    private beatsPlayed: number = 0;

    /**
     * Beats that have previously been played.
     */
    public readonly playedBeats: Map<number, number> = new Map<
        number,
        number
    >();

    /**
     * Time when the song first started playing.
     */
    public readonly startTime: number = new Date().getTime();

    /**
     * Current chance to branch in percent.
     */
    public currentRandomBranchChance: number;

    private readonly onProgressSubject: Subject<DriverState> =
        new Subject<DriverState>();

    public onProgress$: Observable<DriverState> =
        this.onProgressSubject.asObservable();

    constructor(
        private readonly songState: Readonly<JukeboxSongState>,
        private readonly settings: Readonly<JukeboxSettings>,
    ) {
        this.currentRandomBranchChance = settings.minRandomBranchChance;
    }

    /**
     * Start the driver.
     */
    public start(): void {
        this.logDebug('Driver started.');

        document.addEventListener('keydown', this.onBounceKeyDown);
        document.addEventListener('keyup', this.onBounceKeyUp);

        Spicetify.Player.addEventListener('onprogress', this.onPlayerProgress);
    }

    private readonly onPlayerProgress = (
        event:
            | (Event & {
                  data: number;
              })
            | undefined,
    ): void => {
        if (event === undefined) {
            return;
        }

        console.log('onprogress', event.data);
        void this.process(event.data);
    };

    private readonly onBounceKeyDown = (event: KeyboardEvent): void => {
        if (event.key === 'Shift') {
            this.bouncing = true;
        }
    };

    private readonly onBounceKeyUp = (event: KeyboardEvent): void => {
        if (event.key === 'Shift') {
            this.bouncing = false;
        }
    };

    /**
     * Process the beats.
     * @param playerProgress Current player progress.
     */
    private async process(playerProgress: number): Promise<void> {
        // Necessary as playerProgress callbacks can keep firing
        // with the previous time even after seeking
        if (this.isSeeking) {
            this.logDebug(
                `Is seeking... ${playerProgress.toString()} -> ${this.currentBeat?.start.toString() ?? ''}`,
            );

            return;
        }

        if (this.currentBeat !== null) {
            if (this.currentBeat.isInBeat(playerProgress)) {
                // We're still in the same beat: continue
                return;
            }
        }

        if (DEBUG) {
            console.time('process');
        }

        this.logDebug(
            `Processing with current beat: ${this.currentBeat?.toString() ?? ''}, player time: ${Spicetify.Player.getProgress().toString()}`,
        );

        // Get the new current tile

        const nextEnd = this.currentBeat?.next?.end;
        const previousStart = this.currentBeat?.previous?.start;
        const outOfSync =
            (nextEnd !== undefined && playerProgress > nextEnd) ||
            (previousStart !== undefined && playerProgress < previousStart);

        if (outOfSync) {
            console.error(
                `Out of sync ! ${playerProgress.toString()} - ${this.currentBeat?.toString() ?? ''}`,
            );
        }

        const lastBeat = this.currentBeat;
        const nextBeatResult = this.getNextBeat(playerProgress, outOfSync);
        this.currentBeat = nextBeatResult.nextBeat;

        if (this.currentBeat === null) {
            // If this happens, it means the driver will stop.
            if (DEBUG) {
                console.timeEnd('process');
            }
            return;
        }

        this.logDebug(
            `Got next beat: ${this.currentBeat.index.toFixed()}, with time: ${this.currentBeat.start.toString()} - ${this.currentBeat.end.toString()}, player time: ${Spicetify.Player.getProgress().toString()}`,
        );

        // Increment the counters

        this.beatsPlayed++;
        this.beatsSinceLastBranch++;

        this.playedBeats.set(
            this.currentBeat.index,
            (this.playedBeats.get(this.currentBeat.index) ?? 0) + 1,
        );

        const playingBeats = new Set<number>();

        if (nextBeatResult.branch !== undefined) {
            playingBeats.add(nextBeatResult.branch.source.index);
            playingBeats.add(nextBeatResult.branch.destination.index);
        } else if (nextBeatResult.nextBeat !== null) {
            playingBeats.add(nextBeatResult.nextBeat.index);
        }

        // Emit a new state with the current progress
        this.onProgressSubject.next({
            beatsPlayed: this.beatsPlayed,
            currentRandomBranchChance: this.currentRandomBranchChance,
            listenTime: new Date().getTime() - this.startTime,
            playingBeats: playingBeats,
            playingBranch: nextBeatResult.branch?.id,
            playedBeats: this.playedBeats,
        });

        // Seek to the new beat if necessary
        await this.playBeat(
            lastBeat,
            this.currentBeat,
            playerProgress,
            outOfSync,
        );

        if (DEBUG) {
            console.timeEnd('process');
        }
    }

    /**
     * Handle seeking to a new beat if there is a jump.
     * If lastBeat + 1 == currentBeat, do nothing.
     * @param lastBeat The last beat that was played.
     * @param currentBeat The current beat that needs to be played.
     * @param playerProgress The player progress.
     * @param outOfSync Indicates if the player is out of sync with the state of the driver.
     */
    private async playBeat(
        lastBeat: Beat | null,
        currentBeat: Beat,
        playerProgress: number,
        outOfSync: boolean,
    ): Promise<void> {
        if (lastBeat === null) {
            // This is the first tile we're playing, do nothing
            return;
        }

        if (lastBeat.index + 1 === currentBeat.index || outOfSync) {
            // We're playing the next beat: do nothing
            return;
        }

        // Instead of playing this beat, jump to another one to play it instead

        // Player progression in the 'no-jump' beat
        const playerOffsetInBeat =
            Spicetify.Player.getProgress() - lastBeat.end;

        // Seek to the jumped beat + player offset
        const playerPositionAfterJump = currentBeat.start + playerOffsetInBeat;

        this.logDebug(
            `Seek to: ${playerPositionAfterJump.toString()}ms, from ${playerProgress.toString()}ms, with offset ${playerOffsetInBeat.toString()}`,
        );

        this.logDebug(
            `Time to get there: ${Math.abs(
                Spicetify.Player.getProgress() - playerProgress,
            ).toString()}ms`,
        );

        if (DEBUG) {
            console.time('seek');
        }

        this.isSeeking = true;
        await getPlatform().PlayerAPI.seekTo(playerPositionAfterJump);
        this.isSeeking = false;

        if (DEBUG) {
            console.timeEnd('seek');
        }
    }

    /**
     * Get the next beat to play.
     * @returns The next beat.
     */
    private getNextBeat(
        playerProgress: number,
        outOfSync: boolean,
    ): NextBeatResult {
        // If no current beat is set, we search the first beat that matches the player progress
        // The jukebox can be enabled midway though the song,
        // Or the player is advancing too fast, so we need to skip beats to catch up
        // Or the user is manually seeking through the song
        if (this.currentBeat === null || outOfSync) {
            const currentBeat =
                this.songState.graph.beats.find(
                    (beat) =>
                        playerProgress >= beat.start &&
                        playerProgress <= beat.end,
                ) ?? this.songState.graph.beats[0];

            return { nextBeat: currentBeat };
        }

        // Keep moving along edges
        if (this.bouncing) {
            if (this.bounceSeed === null) {
                this.bounceSeed = this.currentBeat;
                this.bounceCount = 0;
            }

            if (this.bounceCount++ % 2 === 1) {
                return this.selectNextNeighbor(this.bounceSeed);
            } else {
                return { nextBeat: this.bounceSeed };
            }
        }

        // Stopped bouncing: continue where we are
        if (this.bounceSeed != null) {
            const nextBeat = this.bounceSeed;
            this.bounceSeed = null;
            return { nextBeat };
        }

        const nextIndex = this.currentBeat.index + 1;

        if (nextIndex >= this.songState.graph.beats.length) {
            // We'll reach the end of the song: disable the driver
            // We'll start again at the next song
            this.stop();
            return { nextBeat: null };
        } else {
            return this.selectRandomNextBeat(
                this.songState.graph.beats[nextIndex],
            );
        }
    }

    /**
     * Returns either the provided next beat, or a beat picked from the next beat's neighbours.
     * @param nextBeat The expected next beat.
     * @returns The selected next beat.
     */
    private selectRandomNextBeat(nextBeat: Beat): NextBeatResult {
        // No branches are leaving this beat: continue
        if (nextBeat.neighbours.length === 0) {
            return { nextBeat };
        }

        if (this.shouldRandomBranch(nextBeat)) {
            const nextNeighbour: Edge = nextBeat.neighbours.shift()!;
            nextBeat.neighbours.push(nextNeighbour);

            this.beatsSinceLastBranch = 0;

            return {
                nextBeat: nextNeighbour.destination,
                branch: nextNeighbour,
            };
        }

        return { nextBeat };
    }

    /**
     * Select the next neighbour for this beat.
     * Used when bouncing along a branch.
     * @param beat The beat.
     * @returns A neighbor for this beat.
     */
    private selectNextNeighbor(beat: Beat): NextBeatResult {
        if (beat.neighbours.length === 0) {
            return { nextBeat: beat };
        }

        const nextNeighbour: Edge = beat.neighbours.shift()!;
        beat.neighbours.push(nextNeighbour);

        return {
            nextBeat: nextNeighbour.destination,
            branch: nextNeighbour,
        };
    }

    /**
     * Decide if the beat should branch.
     * @param beat The beat.
     * @returns True if the beat should branch.
     */
    private shouldRandomBranch(beat: Beat): boolean {
        const currentPlayTime = new Date().getTime() - this.startTime;

        // Stop following branches if the max play time has been reached
        if (
            this.settings.maxJukeboxPlayTime > 0 &&
            currentPlayTime > this.settings.maxJukeboxPlayTime
        ) {
            this.currentRandomBranchChance = 0;
            return false;
        }

        // Branch if this is our last opportunity
        if (
            beat.index === this.songState.graph.lastBranchPoint &&
            this.settings.alwaysFollowLastBranch
        ) {
            return true;
        }

        // Don't branch too fast
        if (this.beatsSinceLastBranch <= MIN_BEATS_BEFORE_BRANCHING) {
            return false;
        }

        const shouldBranch = Math.random() < this.currentRandomBranchChance;

        if (shouldBranch) {
            this.currentRandomBranchChance =
                this.settings.minRandomBranchChance;
        } else {
            this.currentRandomBranchChance = Math.min(
                this.currentRandomBranchChance +
                    this.settings.randomBranchChanceDelta,
                this.settings.maxRandomBranchChance,
            );
        }

        return shouldBranch;
    }

    /**
     * Stops the driver.
     */
    public stop(): void {
        Spicetify.Player.removeEventListener(
            'onprogress',
            this.onPlayerProgress,
        );

        document.removeEventListener('keydown', this.onBounceKeyDown);
        document.removeEventListener('keyup', this.onBounceKeyUp);
    }

    private logDebug(message: string): void {
        if (DEBUG) {
            console.log(message);
        }
    }
}
