import type { SimplifiedEpisode } from './simplified-episode';
import type { SimplifiedShow } from './simplified-show';

export type Episode = SimplifiedEpisode & {
    show: SimplifiedShow;
};
