import { SortOrder } from '../models/sort-option';

export function sort<T>(first: T, second: T, order: SortOrder) {
    const type = order === 'descending' ? -1 : 1;

    if (first > second) {
        return 1 * type;
    }
    if (first < second) {
        return -1 * type;
    }

    return 0;
}
