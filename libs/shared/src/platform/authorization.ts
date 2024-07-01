export type AuthorizationState = {
    isAuthorized: boolean;
    retryAt: unknown;
    retryAttempt: unknown;
    token: {
        accessToken: string;
        accessTokenExpirationTimestampMs: number;
        isAnonymous: boolean;
    };
};

export type AuthorizationAPI = {
    getState: () => AuthorizationState;
};
