/**
 * Audio analysis for a track.
 */
export type AudioAnalysis = {
    meta: {
        /**
         * The version of the Analyzer used to analyze this track.
         */
        analyzer_version: string;

        /**
         * The platform used to read the track's audio data.
         */
        platform: string;

        /**
         * A detailed status code for this track.
         * If analysis data is missing, this code may explain why.
         */
        detailed_status: string;

        /**
         * The return code of the analyzer process. 0 if successful, 1 if any errors occurred.
         */
        status_code: 0 | 1;

        /**
         * The Unix timestamp (in seconds) at which this track was analyzed.
         */
        timestamp: number;

        /**
         * The amount of time taken to analyze this track.
         */
        analysis_time: number;

        /**
         * The method used to read the track's audio data.
         */
        input_process: string;
    };

    track: {
        /**
         * The exact number of audio samples analyzed from this track. See also analysis_sample_rate.
         */
        num_samples: number;

        /**
         * Length of the track in seconds.
         */
        duration: number;

        /**
         * This field will always contain the empty string.
         */
        sample_md5: '';

        /**
         * An offset to the start of the region of the track that was analyzed.
         * (As the entire track is analyzed, this should always be 0.)
         */
        offset_seconds: 0 | number;

        /**
         * The length of the region of the track was analyzed, if a subset of the track was analyzed.
         * (As the entire track is analyzed, this should always be 0.)
         */
        window_seconds: 0 | number;

        /**
         * The sample rate used to decode and analyze this track.
         * May differ from the actual sample rate of this track available on Spotify.
         */
        analysis_sample_rate: number;

        /**
         * The number of channels used for analysis. If 1, all channels are summed together to mono before analysis.
         */
        analysis_channels: number;

        /**
         * The time, in seconds, at which the track's fade-in period ends.
         * If the track has no fade-in, this will be 0.0.
         */
        end_of_fade_in: number;

        /**
         * The time, in seconds, at which the track's fade-out period starts.
         * If the track has no fade-out, this should match the track's length.
         */
        start_of_fade_out: number;

        /**
         * The overall loudness of a track in decibels (dB).
         * Loudness values are averaged across the entire track and are useful for comparing relative loudness of tracks.
         * Loudness is the quality of a sound that is the primary psychological correlate of physical strength (amplitude).
         * Values typically range between -60 and 0 db.
         */
        loudness: number;

        /**
         * The overall estimated tempo of a track in beats per minute (BPM).
         * In musical terminology, tempo is the speed or pace of a given piece and derives directly from the average beat duration.
         */
        tempo: number;

        /**
         * The confidence, from 0.0 to 1.0, of the reliability of the tempo.
         */
        tempo_confidence: number;

        /**
         * An estimated time signature. The time signature (meter) is a notational convention to specify how many beats are in each bar (or measure).
         * The time signature ranges from 3 to 7 indicating time signatures of "3/4", to "7/4".
         */
        time_signature: number;

        /**
         * The confidence, from 0.0 to 1.0, of the reliability of the time_signature.
         */
        time_signature_confidence: number;

        /**
         * The key the track is in. Integers map to pitches using standard Pitch Class notation.
         * E.g. 0 = C, 1 = C♯/D♭, 2 = D, and so on. If no key was detected, the value is -1.
         */
        key: number;

        /**
         * The confidence, from 0.0 to 1.0, of the reliability of the key.
         */
        key_confidence: number;

        /**
         * Mode indicates the modality (major or minor) of a track, the type of scale from which its melodic content is derived.
         * Major is represented by 1 and minor is 0.
         */
        mode: 0 | 1;

        /**
         * The confidence, from 0.0 to 1.0, of the reliability of the mode.
         */
        mode_confidence: number;

        /**
         * An Echo Nest Musical Fingerprint (ENMFP) codestring for this track.
         */
        codestring: string;

        /**
         * A version number for the Echo Nest Musical Fingerprint format used in the codestring field.
         */
        code_version: number;

        /**
         * An EchoPrint codestring for this track.
         */
        echoprintstring: string;

        /**
         * A version number for the EchoPrint format used in the echoprintstring field.
         */
        echoprint_version: number;

        /**
         * A Synchstring for this track.
         */
        synchstring: string;

        /**
         * A version number for the Synchstring used in the synchstring field.
         */
        synch_version: number;

        /**
         * A Rhythmstring for this track. The format of this string is similar to the Synchstring.
         */
        rhythmstring: string;

        /**
         * A version number for the Rhythmstring used in the rhythmstring field.
         */
        rhythm_version: number;
    };

    /**
     * The time intervals of the bars throughout the track.
     * A bar (or measure) is a segment of time defined as a given number of beats.
     */
    bars: TimeInterval[];

    /**
     * The time intervals of beats throughout the track.
     * A beat is the basic time unit of a piece of music; for example, each tick of a metronome.
     * Beats are typically multiples of tatums.
     */
    beats: TimeInterval[];

    /**
     * Sections are defined by large variations in rhythm or timbre, e.g. chorus, verse, bridge, guitar solo, etc.
     * Each section contains its own descriptions of tempo, key, mode, time_signature, and loudness.
     */
    sections: Section[];

    /**
     * Each segment contains a roughly consistent sound throughout its duration.
     */
    segments: Segment[];

    /**
     * A tatum represents the lowest regular pulse train that a listener intuitively infers from the timing of perceived musical events (segments).
     */
    tatums: TimeInterval[];
};

export type TimeInterval = {
    /**
     * The starting point (in seconds) of the time interval.
     */
    start: number;

    /**
     * The duration (in seconds) of the time interval.
     */
    duration: number;

    /**
     * The confidence, from 0.0 to 1.0, of the reliability of the interval.
     */
    confidence: number;
};

export type Section = {
    /**
     * The starting point (in seconds) of the section.
     */
    start: number;

    /**
     * The duration (in seconds) of the section.
     */
    duration: number;

    /**
     * The confidence, from 0.0 to 1.0, of the reliability of the section's "designation".
     */
    confidence: number;

    /**
     * The overall loudness of the section in decibels (dB).
     * Loudness values are useful for comparing relative loudness of sections within tracks.
     */
    loudness: number;

    /**
     * The overall estimated tempo of the section in beats per minute (BPM).
     * In musical terminology, tempo is the speed or pace of a given piece and derives directly from the average beat duration.
     */
    tempo: number;

    /**
     * The confidence, from 0.0 to 1.0, of the reliability of the tempo.
     * Some tracks contain tempo changes or sounds which don't contain tempo (like pure speech) which would correspond to a low value in this field.
     */
    tempo_confidence: number;

    /**
     * The estimated overall key of the section.
     * The values in this field ranging from 0 to 11 mapping to pitches using standard Pitch Class notation (E.g. 0 = C, 1 = C♯/D♭, 2 = D, and so on).
     * If no key was detected, the value is -1.
     */
    key: number;

    /**
     * The confidence, from 0.0 to 1.0, of the reliability of the key.
     * Songs with many key changes may correspond to low values in this field.
     */
    key_confidence: number;

    /**
     * Indicates the modality (major or minor) of a section, the type of scale from which its melodic content is derived.
     * This field will contain a 0 for "minor", a 1 for "major", or a -1 for no result.
     * Note that the major key (e.g. C major) could more likely be confused with the minor key at 3 semitones lower (e.g. A minor) as both keys carry the same pitches.
     */
    mode: number;

    /**
     * The confidence, from 0.0 to 1.0, of the reliability of the mode.
     */
    mode_confidence: number;

    /**
     * An estimated time signature. The time signature (meter) is a notational convention to specify how many beats are in each bar (or measure).
     * The time signature ranges from 3 to 7 indicating time signatures of "3/4", to "7/4".
     */
    time_signature: number;

    /**
     * The confidence, from 0.0 to 1.0, of the reliability of the time_signature. S
     * ections with time signature changes may correspond to low values in this field.
     */
    time_signature_confidence: number;
};

export type Segment = {
    /**
     * The starting point (in seconds) of the segment.
     */
    start: number;

    /**
     * The duration (in seconds) of the segment.
     */
    duration: number;

    /**
     * The confidence, from 0.0 to 1.0, of the reliability of the segmentation.
     * Segments of the song which are difficult to logically segment (e.g: noise) may correspond to low values in this field.
     */
    confidence: number;

    /**
     * The onset loudness of the segment in decibels (dB).
     * Combined with loudness_max and loudness_max_time, these components can be used to describe the "attack" of the segment.
     */
    loudness_start: number;

    /**
     * The peak loudness of the segment in decibels (dB).
     * Combined with loudness_start and loudness_max_time, these components can be used to describe the "attack" of the segment.
     */
    loudness_max: number;

    /**
     * The segment-relative offset of the segment peak loudness in seconds.
     * Combined with loudness_start and loudness_max, these components can be used to desctibe the "attack" of the segment.
     */
    loudness_max_time: number;

    /**
     * The offset loudness of the segment in decibels (dB).
     * This value should be equivalent to the loudness_start of the following segment.
     */
    loudness_end: number;

    /**
     * Pitch content is given by a “chroma” vector, corresponding to the 12 pitch classes C, C#, D to B, with values ranging from 0 to 1 that describe the relative dominance of every pitch in the chromatic scale.
     * For example a C Major chord would likely be represented by large values of C, E and G (i.e. classes 0, 4, and 7).
     *
     * Vectors are normalized to 1 by their strongest dimension, therefore noisy sounds are likely represented by values that are all close to 1, while pure tones are described by one value at 1 (the pitch) and others near 0.
     */
    pitches: number[];

    /**
     * Timbre is the quality of a musical note or sound that distinguishes different types of musical instruments, or voices.
     * It is a complex notion also referred to as sound color, texture, or tone quality, and is derived from the shape of a segment’s spectro-temporal surface, independently of pitch and loudness.
     * The timbre feature is a vector that includes 12 unbounded values roughly centered around 0.
     * Those values are high level abstractions of the spectral surface, ordered by degree of importance.
     */
    timbre: number[];
};
