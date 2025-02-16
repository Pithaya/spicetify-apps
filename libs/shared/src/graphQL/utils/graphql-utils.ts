import type { GraphQLErrorResponse } from '../models/graphql-error-response';
import type { GraphQLResponse } from '../models/graphql-response';

// TODO: Remove and replace with destructure
function isErrorResponse<T>(
    response: GraphQLResponse<T | null>,
): response is GraphQLErrorResponse {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (response as any).errors !== undefined;
}

function throwWithErrorMessage(response: GraphQLErrorResponse): never {
    throw new Error(response.errors.map((e) => e.message).join('\n'));
}

export async function sendGraphQLQuery<T>(
    definition: any,
    variables?: Record<string, any>,
): Promise<T> {
    const response: GraphQLResponse<T> = await Spicetify.GraphQL.Request(
        definition,
        variables,
    );

    if (isErrorResponse(response)) {
        throwWithErrorMessage(response);
    }

    return response.data;
}
