export type RequestBuilder = {
    build: () => RequestBuilderSender;
};

export type RequestBuilderSender = {
    withHost: (host: string) => RequestBuilderSender;
    withPath: (path: string) => RequestBuilderSender;
    withQueryParameters: (
        queryParameters: Record<string, string>,
    ) => RequestBuilderSender;
    withoutMarket: () => RequestBuilderSender;
    withEndpointIdentifier: (edpointIdentifier: string) => RequestBuilderSender;
    send: <T>() => Promise<T>;
};
