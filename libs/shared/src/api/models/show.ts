import type { Page } from './page';
import type { SimplifiedEpisode } from './simplified-episode';
import type { SimplifiedShow } from './simplified-show';

export type Show = SimplifiedShow & {
    episodes: Page<SimplifiedEpisode>;
};
