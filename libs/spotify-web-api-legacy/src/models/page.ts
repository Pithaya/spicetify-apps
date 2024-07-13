/**
 * A page of content.
 */
export type Page<T> = {
    /**
     * A link to the Web API endpoint returning the full result of the request.
     */
    href: string;

    /**
     * The requested content.
     */
    items: T[];

    /**
     * The maximum number of items in the response (as set in the query or by default).
     */
    limit: number;

    /**
     * URL to the next page of items (null if none).
     */
    next: string | null;

    /**
     * The offset of the items returned (as set in the query or by default).
     */
    offset: number;

    /**
     * URL to the previous page of items (null if none).
     */
    previous: string | null;

    /**
     * The total number of items available to return.
     */
    total: number;
};

export class EmptyPage<T> implements Page<T> {
    href: string = '';
    items: T[] = [];
    limit: number = 0;
    next: string | null = null;
    offset: number = 0;
    previous: string | null = null;
    total: number = 0;
}
