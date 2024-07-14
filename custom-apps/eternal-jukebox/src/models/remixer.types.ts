import type { Section, Segment } from '@spotify-web-api';
import type {
    ChildQuantum,
    hasOverlappingSegments,
    ParentQuantum,
} from './quantum.types';
import type { TimeInterval } from './time-interval';

/**
 * An `AudioAnalysis` processed by the remixer.
 */
export type RemixedAnalysis = {
    sections: RemixedSection[];

    bars: RemixedTimeInterval[];

    beats: RemixedTimeInterval[];

    tatums: RemixedTimeInterval[];

    segments: RemixedSegment[];
};

export type RemixedSection = Section & ParentQuantum;

export type RemixedTimeInterval = TimeInterval &
    hasOverlappingSegments &
    ParentQuantum &
    ChildQuantum;

export type RemixedSegment = Segment & ChildQuantum;
