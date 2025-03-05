import { type GraphQLResponse } from '../models/graphql-response';
import { type QueryDefinition } from '../models/query-definition';

function throwWithErrorMessage(
    errors: NonNullable<GraphQLResponse<unknown>['errors']>,
): never {
    throw new Error(errors.map((e) => e.message).join('\n'));
}

export async function sendGraphQLQuery<T>(
    definition: QueryDefinition,
    variables?: Record<string, string | number | boolean>,
): Promise<T> {
    const { data, errors } = (await Spicetify.GraphQL.Request(
        definition,
        variables,
    )) as GraphQLResponse<T>;

    if (errors) {
        throwWithErrorMessage(errors);
    }

    return data;
}
