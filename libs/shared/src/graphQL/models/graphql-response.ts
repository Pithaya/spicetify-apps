export type GraphQLResponse<T> = {
    data: T;
    extensions: unknown;
    errors?: {
        extensions: { classification: string }[];
        message: string;
        path?: string[];
        locations?: { line: number; column: number }[];
    }[];
};
