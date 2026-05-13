export type SearchPage<T> = {
    items: T[];
    pagingInfo: {
        limit: number;
        nextOffset: number | null;
    };
    totalCount: number;
};
