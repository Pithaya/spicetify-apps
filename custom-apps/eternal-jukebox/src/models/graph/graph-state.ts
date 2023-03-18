import { RemixedSegment, RemixedTimeInterval } from '../remixer.types';
import { Beat } from './beat';

export interface IGraphState {
    beats: Beat[];
    segments: RemixedSegment[];
    remixedBeats: RemixedTimeInterval[];
}
