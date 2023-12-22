import type { HeaderKey } from '../constants/constants';

/**
 * Sort option to display in the sort dropdown.
 */
export type SortOption = {
    key: HeaderKey;
    label: string;
};

/**
 * The sort order.
 */
export type SortOrder = 'ascending' | 'descending';

/**
 * A selected sort option.
 */
export type SelectedSortOption = {
    key: HeaderKey;
    order: SortOrder;
};

/**
 * Display type to display in the sort dropdown.
 */
export type DisplayType = 'list' | 'compact' | 'grid';

export const displayIcons: Record<DisplayType, Spicetify.Icon> = {
    list: 'list-view',
    compact: 'menu',
    grid: 'grid-view',
};
