import type { Observable } from 'rxjs';
import { BehaviorSubject, fromEvent, Subject, Subscription } from 'rxjs';
import { GraphGenerator } from '../helpers/graph-generator.js';
import { Remixer } from '../helpers/remixer';
import type { JukeboxSettings } from './jukebox-settings.js';
import { JukeboxSongState } from './jukebox-song-state';

import { getTrackAudioAnalysis } from '@shared/api/endpoints/tracks/get-audio-analysis';
import type { AudioAnalysis } from '@shared/api/models/audio-analysis';
import { Driver } from '../driver';
import { SettingsService } from '../services/settings-service';

export type StatsChangedEvent = {
    beatsPlayed: number;
    currentRandomBranchChance: number;
    listenTime: number;
};

/**
 * Global class to control the jukebox.
 */
export class Jukebox {
    // #region Properties

    private readonly songStateSubject: BehaviorSubject<JukeboxSongState | null> =
        new BehaviorSubject<JukeboxSongState | null>(null);

    /**
     * The jukebox state for the current track.
     * This is generated once for the song and used by the driver.
     */
    public readonly songState$: Observable<JukeboxSongState | null> =
        this.songStateSubject.asObservable();

    private readonly isEnabledSubject: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    public isEnabled$: Observable<boolean> =
        this.isEnabledSubject.asObservable();

    /**
     * Jukebox settings.
     */
    public settings: JukeboxSettings;

    /**
     * Jukebox driver.
     */
    private driver: Driver | null = null;

    // #endregion

    // #region Subscriptions

    private songChangedSubscription: Subscription = new Subscription();
    private driverProcessSubscription: Subscription = new Subscription();

    private readonly statsSubject: Subject<StatsChangedEvent> =
        new Subject<StatsChangedEvent>();

    public statsChanged$: Observable<StatsChangedEvent> =
        this.statsSubject.asObservable();

    public constructor() {
        this.settings = SettingsService.settings;
    }

    public async reloadSettings(): Promise<void> {
        this.settings = SettingsService.settings;

        if (this.isEnabledSubject.value) {
            await this.restart();
        }
    }

    public async toggle(): Promise<void> {
        if (this.isEnabledSubject.value) {
            this.disable();
        } else {
            await this.enable();
        }
    }

    public async restart(): Promise<void> {
        this.stop();
        await this.start();
    }

    /**
     * Starts the Jukebox.
     */
    public async enable(): Promise<void> {
        this.isEnabledSubject.next(true);

        const songChange$ = fromEvent(Spicetify.Player, 'songchange');
        const subscription = songChange$.subscribe(() => {
            void this.restart();
        });

        this.songChangedSubscription.add(subscription);

        await this.start();
    }

    /**
     * Disable the Jukebox.
     */
    public disable(): void {
        this.stop();
        this.songChangedSubscription.unsubscribe();
        this.songChangedSubscription = new Subscription();

        this.isEnabledSubject.next(false);
    }

    /**
     * Stops the Jukebox.
     */
    private stop(): void {
        this.driver?.stop();
        this.driver = null;
        this.driverProcessSubscription.unsubscribe();
        this.driverProcessSubscription = new Subscription();
        this.songStateSubject.next(null);
    }

    /**
     * Initialize and start the jukebox for the current track.
     */
    private async start(): Promise<void> {
        const currentTrack = Spicetify.Player.data?.item;

        if (currentTrack === undefined) {
            this.disableWithError('No track is currently playing.');
            return;
        }

        Spicetify.showNotification('Fetching analysis for song...');

        const uri = currentTrack.uri;

        if (Spicetify.URI.isLocalTrack(uri)) {
            this.disableWithError('No analysis available for local tracks.');
            return;
        }

        if (Spicetify.URI.isEpisode(uri)) {
            this.disableWithError('No analysis available for shows.');
            return;
        }

        let analysis: AudioAnalysis | null = null;

        try {
            analysis = await getTrackAudioAnalysis({ uri });
        } catch {
            // Do nothing
        }

        if (analysis === null || analysis.beats.length === 0) {
            this.disableWithError('No analysis available for this track.');
            return;
        }

        // Preprocess the track
        const remixedAnalysis = new Remixer(analysis).remixTrack();

        // Generate branches
        const branchGenerator = new GraphGenerator(
            this.settings,
            remixedAnalysis.beats,
        );

        const graph = branchGenerator.generateGraph();

        const songState = new JukeboxSongState(
            currentTrack,
            remixedAnalysis,
            graph,
        );

        this.songStateSubject.next(songState);

        this.driver = new Driver(songState, this.settings);

        this.driverProcessSubscription.add(
            this.driver.onProgress$.subscribe(() => {
                const songState = this.songStateSubject.value;

                this.statsSubject.next({
                    beatsPlayed: songState?.beatsPlayed ?? 0,
                    currentRandomBranchChance:
                        songState?.currentRandomBranchChance ?? 0,
                    listenTime:
                        songState !== null
                            ? new Date().getTime() - songState.startTime
                            : 0,
                });
            }),
        );

        this.driver.start();
    }

    private disableWithError(error: string): void {
        Spicetify.showNotification(error, true);
        this.disable();
    }
}
