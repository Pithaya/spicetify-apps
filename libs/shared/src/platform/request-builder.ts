export type RequestBuilder = {
    build: () => RequestSender;
};

export type RequestSender = {
    withMethod: (method: 'GET' | 'PUT' | 'PATCH' | 'POST') => RequestSender;
    withHost: (host: string) => RequestSender;
    withPath: (path: string) => RequestSender;
    withBody: (body: Record<string, unknown>) => RequestSender;
    withQueryParameters: (
        queryParameters: Record<string, string | undefined>,
    ) => RequestSender;
    withoutMarket: () => RequestSender;
    withEndpointIdentifier: (edpointIdentifier: string) => RequestSender;
    withJsonContentType: () => RequestSender;
    send: <T>() => Promise<RequestSenderResponse<T>>;
};

export type RequestSenderResponse<TBody> = {
    url: string;
    status: number;
    headers: unknown;
    body: TBody;
    offline: boolean;
    timing: unknown;
    metadata: unknown;
    retries: {
        count: number;
    };
    ok: boolean;
};
