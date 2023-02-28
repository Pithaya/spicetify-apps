export interface SortOption {
    key: string;
    label: string;
}

export interface SelectedSortOption extends SortOption {
    order: 'asc' | 'desc';
}
