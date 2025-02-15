import type { Page } from './page';
import type { SimplifiedAudiobook } from './simplified-audiobook';
import type { SimplifiedChapter } from './simplified-chapter';

export type Audiobook = SimplifiedAudiobook & {
    chapters: Page<SimplifiedChapter>;
};
