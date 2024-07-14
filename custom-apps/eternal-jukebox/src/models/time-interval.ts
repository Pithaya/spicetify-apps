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
