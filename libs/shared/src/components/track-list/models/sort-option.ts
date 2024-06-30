/**
 * Possible header keys for sorting.
 */
export type HeaderKey = 'title' | 'artist' | 'album' | 'date' | 'duration';

/**
 * A track list header.
 */
export type TrackListHeaderOption = {
    key: HeaderKey;
    label: string;
};

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

/**
 * Icons for the display types.
 */
export const displayIcons: Record<DisplayType, Spicetify.Icon> = {
    list: 'list-view',
    compact: 'menu',
    grid: 'grid-view',
};
