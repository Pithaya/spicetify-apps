/**
 * Default track list headers.
 */
export type DefaultHeaders = 'duration';

/**
 * Possible header keys for sorting.
 */
export type LibraryHeaders = 'title' | 'artist' | 'album' | 'date';

export type HeaderKey<T extends string> = T | DefaultHeaders;

/**
 * A track list header.
 */
export type TrackListHeaderOption<T extends string> = {
    key: HeaderKey<T>;
    label: string;
};

/**
 * Sort option to display in the sort dropdown.
 */
export type SortOption<T extends string> = {
    key: HeaderKey<T>;
    label: string;
};

/**
 * The sort order.
 */
export type SortOrder = 'ascending' | 'descending';

/**
 * A selected sort option.
 */
export type SelectedSortOption<T extends string> = {
    key: HeaderKey<T>;
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
