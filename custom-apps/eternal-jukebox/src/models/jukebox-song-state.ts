import type { SongGraph } from './graph/song-graph';
import type { RemixedAnalysis } from './remixer.types';

/**
 * Contains the state of the jukebox for the current song.
 * Reset every time the song changes.
 */
export type JukeboxSongState = {
    /**
     * The current track.
     */
    readonly track: Spicetify.ContextTrack;

    /**
     * The remixed analysis for the track.
     */
    readonly analysis: RemixedAnalysis;

    /**
     * The generated song graph.
     */
    readonly graph: SongGraph;
};
