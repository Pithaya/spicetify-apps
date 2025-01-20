import type { GraphQLResponse } from './graphql-response';

export type GraphQLErrorResponse = GraphQLResponse<null> & {
    errors: {
        extensions: { classification: string }[];
        message: string;
        path?: string[];
        locations?: { line: number; column: number }[];
    }[];
};
