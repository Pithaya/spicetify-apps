export class PageParameters {
    /**
     * The maximum number of items to return.
     * Default: 20.
     * Minimum: 1.
     * Maximum: 50.
     */
    public readonly limit: number;

    /**
     * The index of the first item to return.
     * Default: 0 (the first item).
     * Use with limit to get the next set of items.
     */
    public readonly offset: number;

    /**
     * An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned.
     * If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.
     * Note: If neither market or user country are provided, the content is considered unavailable for the client.
     * Users can view the country that is associated with their account in the account settings.
     */
    public readonly market?: string;

    constructor(limit: number = 20, offset: number = 0, market?: string) {
        if (limit < 1 || limit > 50) {
            throw new Error(
                'The limit parameter must be more than 1 and less than 50.',
            );
        }

        this.limit = limit;
        this.offset = offset;
        this.market = market;
    }

    public toQueryString(): string {
        let query = `offset=${this.offset}&limit=${this.limit}`;

        if (this.market !== undefined) {
            query = `${query}&market=${this.market}`;
        }

        return query;
    }
}
