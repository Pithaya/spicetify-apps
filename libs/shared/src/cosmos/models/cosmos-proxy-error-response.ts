export type CosmosProxyErrorResponse = {
    /**
     * Response status
     */
    code: number;
    /**
     * Response status text
     */
    error: string;
    message: 'Failed to fetch';
    stack: undefined;
};
