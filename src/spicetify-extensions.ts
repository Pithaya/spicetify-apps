function createProxyHandler(apiName: string): ProxyHandler<typeof Spicetify.CosmosAsync> {
    const handler = {
        get(target: typeof Spicetify.CosmosAsync, property: string, receiver: any) {
            const targetValue = Reflect.get(target, property, receiver);

            if (typeof targetValue === 'function') {
                return function (...args: unknown[]) {
                    console.log(`[${apiName}] - CALL`, property, args);
                    return targetValue.apply(this, args);
                };
            } else {
                console.log(`[${apiName}] - GET`, property);
                return targetValue;
            }
        }
    };

    return handler;
}

function registerProxy(): void {
    for (const [key, value] of Object.entries(Spicetify.Platform)) {
        if ((value as any)._cosmos !== undefined) {
            const proxy = new Proxy(Spicetify.CosmosAsync, createProxyHandler(key));
            (value as any)._cosmos = proxy;
        }
    }
}

export function registerExtensions(): void {
    Spicetify.CosmosAsync.registerProxy = registerProxy;
}
