import { HeaderKey } from '../constants/constants';

/**
 * Sort option to display in the sort dropdown.
 */
export interface SortOption {
    key: HeaderKey;
    label: string;
}

/**
 * The sort order.
 */
export type SortOrder = 'ascending' | 'descending';

/**
 * A selected sort option.
 */
export interface SelectedSortOption {
    key: HeaderKey;
    order: SortOrder;
}
