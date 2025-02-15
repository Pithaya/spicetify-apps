import type { SimplifiedAudiobook } from './simplified-audiobook';
import type { SimplifiedChapter } from './simplified-chapter';

export type Chapter = SimplifiedChapter & {
    audiobook: SimplifiedAudiobook;
};
