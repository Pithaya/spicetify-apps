export type Page<TItemType> = {
    href: string;
    items: TItemType[];
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
};
