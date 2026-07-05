import type { Observable } from 'rxjs';
import { BehaviorSubject, fromEvent, Subject, Subscription } from 'rxjs';
import { GraphGenerator } from '../helpers/graph-generator.js';
import { Remixer } from '../helpers/remixer';
import type { JukeboxSettings } from './jukebox-settings.js';
import { JukeboxSongState } from './jukebox-song-state';

import type { AudioAnalysis } from '@shared/api/models/audio-analysis';
import { searchTracks } from '@shared/graphQL/queries/search-tracks';
import { Driver } from '../driver';
import { SettingsService } from '../services/settings-service';

const ALTERNATE_TRACK_SEARCH_LIMIT = 20;
const MAX_ALTERNATE_TRACKS_TO_PROBE = 8;
const MAX_DURATION_DIFFERENCE_MS = 1_500;

export type StatsChangedEvent = {
    beatsPlayed: number;
    currentRandomBranchChance: number;
    listenTime: number;
};

/**
 * Global class to control the jukebox.
 */
export class Jukebox {
    /**
     * The jukebox state for the current track.
     */
    private _songState: JukeboxSongState | null = null;

    private readonly songStateSubject: BehaviorSubject<JukeboxSongState | null> =
        new BehaviorSubject<JukeboxSongState | null>(null);

    public songState$: Observable<JukeboxSongState | null> =
        this.songStateSubject.asObservable();

    public get songState(): JukeboxSongState | null {
        return this._songState;
    }

    public set songState(value: JukeboxSongState | null) {
        this._songState = value;
        this.songStateSubject.next(value);
    }

    /**
     * Jukebox settings.
     */
    public settings: JukeboxSettings;

    /**
     * Jukebox driver.
     */
    private driver: Driver | null = null;

    public get isEnabled(): boolean {
        return this.stateChangedSubject.value;
    }

    public async setEnabled(value: boolean): Promise<void> {
        if (value) {
            await this.enable();
        } else {
            this.disable();
        }
    }

    private songChangedSubscription: Subscription = new Subscription();
    private driverProcessSubscription: Subscription = new Subscription();

    private readonly statsChangedSubject: Subject<StatsChangedEvent> =
        new Subject<StatsChangedEvent>();

    public statsChanged$: Observable<StatsChangedEvent> =
        this.statsChangedSubject.asObservable();

    private readonly stateChangedSubject: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    public stateChanged$: Observable<boolean> =
        this.stateChangedSubject.asObservable();

    public constructor() {
        this.settings = SettingsService.settings;
    }

    public async reloadSettings(): Promise<void> {
        this.settings = SettingsService.settings;

        if (this.isEnabled) {
            this.stop();
            await this.start();
        }
    }

    /**
     * Starts the Jukebox.
     */
    public async enable(): Promise<void> {
        this.stateChangedSubject.next(true);

        // FIXME: Don't use a subscription here
        const source = fromEvent(Spicetify.Player, 'songchange');
        const subscription = source.subscribe(() => {
            this.stop();
            void this.start();
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

        this.stateChangedSubject.next(false);
    }

    /**
     * Stops the Jukebox.
     */
    private stop(): void {
        this.driver?.stop();
        this.driver = null;
        this.driverProcessSubscription.unsubscribe();
        this.driverProcessSubscription = new Subscription();
        this.songState = null;
    }

    /**
     * Initialize and start the jukebox for the current track.
     */
    private async start(): Promise<void> {
        const currentTrack = Spicetify.Player.data.item;

        if (currentTrack === undefined) {
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

        let analysis = await this.fetchUsableAnalysis(uri);

        analysis ??= await this.findAlternateTrackAnalysis(currentTrack);

        if (analysis === null) {
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

        this.songState = new JukeboxSongState(
            currentTrack,
            remixedAnalysis,
            graph,
        );

        this.driver = new Driver(this.songState, this.settings);
        this.driverProcessSubscription.add(
            this.driver.onProgress$.subscribe(() => {
                this.statsChangedSubject.next({
                    beatsPlayed: this.songState?.beatsPlayed ?? 0,
                    currentRandomBranchChance:
                        this.songState?.currentRandomBranchChance ?? 0,
                    listenTime:
                        this.songState !== null
                            ? new Date().getTime() - this.songState.startTime
                            : 0,
                });
            }),
        );
        this.driver.start();
    }

    /**
     * Fetch analysis while accounting for Spicetify returning HTTP error
     * objects as successful values.
     */
    private async fetchUsableAnalysis(
        uri: string,
    ): Promise<AudioAnalysis | null> {
        try {
            const analysis: unknown = await Spicetify.getAudioData(uri);

            if (this.isUsableAnalysis(analysis)) {
                return analysis;
            }
        } catch {
            // Try an equivalent catalog entry below.
        }

        return null;
    }

    /**
     * Spotify sometimes replaces a track with a new catalog ID without
     * copying its audio analysis. Find another release of the same recording
     * and use its analysis when the title, artist, and duration all match.
     */
    private async findAlternateTrackAnalysis(
        currentTrack: Spicetify.PlayerTrack,
    ): Promise<AudioAnalysis | null> {
        const artistName =
            currentTrack.artists?.[0]?.name ??
            currentTrack.metadata.artist_name ??
            currentTrack.metadata['canvas.artist.name'];

        if (!artistName) {
            return null;
        }

        const escapeSearchValue = (value: string): string =>
            value.replaceAll('\\', '\\\\').replaceAll('"', '\\"');

        try {
            const result = await searchTracks({
                searchTerm: `track:"${escapeSearchValue(currentTrack.name)}" artist:"${escapeSearchValue(artistName)}"`,
                offset: 0,
                limit: ALTERNATE_TRACK_SEARCH_LIMIT,
                numberOfTopResults: 0,
                includePreReleases: true,
            });

            const normalizedTitle = this.normalizeText(currentTrack.name);
            const normalizedArtist = this.normalizeText(artistName);
            const currentDuration = currentTrack.duration.milliseconds;

            const candidates = result.searchV2.tracksV2.items
                .map((item) => item.item.data)
                .filter((track) => track.__typename === 'Track')
                .filter((track) => track.uri !== currentTrack.uri)
                .filter(
                    (track) =>
                        this.normalizeText(track.name) === normalizedTitle &&
                        track.artists.items.some(
                            (artist) =>
                                this.normalizeText(artist.profile.name) ===
                                normalizedArtist,
                        ),
                )
                .filter(
                    (track) =>
                        Math.abs(
                            track.duration.totalMilliseconds - currentDuration,
                        ) <= MAX_DURATION_DIFFERENCE_MS,
                )
                .sort(
                    (left, right) =>
                        Math.abs(
                            left.duration.totalMilliseconds - currentDuration,
                        ) -
                        Math.abs(
                            right.duration.totalMilliseconds - currentDuration,
                        ),
                )
                .slice(0, MAX_ALTERNATE_TRACKS_TO_PROBE);

            for (const candidate of candidates) {
                const analysis = await this.fetchUsableAnalysis(candidate.uri);

                if (
                    analysis !== null &&
                    Math.abs(
                        analysis.track.duration * 1_000 - currentDuration,
                    ) <= MAX_DURATION_DIFFERENCE_MS
                ) {
                    Spicetify.showNotification(
                        'Using analysis from an equivalent Spotify release.',
                    );
                    return analysis;
                }
            }
        } catch (error) {
            console.error(
                '[Eternal Jukebox] Failed to find alternate track analysis',
                error,
            );
        }

        return null;
    }

    private normalizeText(value: string): string {
        return value
            .normalize('NFKD')
            .replace(/\p{Diacritic}/gu, '')
            .toLocaleLowerCase()
            .replace(/[^a-z0-9]+/g, ' ')
            .trim();
    }

    private isUsableAnalysis(value: unknown): value is AudioAnalysis {
        if (typeof value !== 'object' || value === null) {
            return false;
        }

        const analysis = value as Partial<AudioAnalysis>;

        return (
            analysis.track !== undefined &&
            Array.isArray(analysis.bars) &&
            Array.isArray(analysis.beats) &&
            analysis.beats.length > 0 &&
            Array.isArray(analysis.sections) &&
            Array.isArray(analysis.segments) &&
            analysis.segments.length > 0 &&
            Array.isArray(analysis.tatums)
        );
    }

    private disableWithError(error: string): void {
        Spicetify.showNotification(error, true);
        this.disable();
    }
}
