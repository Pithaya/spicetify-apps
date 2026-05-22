import type { Platform } from '@shared/platform/platform';

function createProxyHandler<T extends object>(
    objectName: string,
    propertiesToIgnore: string[] = [],
): ProxyHandler<T> {
    const handler = {
        get(target: T, property: string, receiver: unknown) {
            const targetValue = Reflect.get(target, property, receiver);

            if (typeof targetValue === 'function') {
                return function (...args: unknown[]) {
                    const result: unknown = targetValue.apply(this, args);

                    // eslint-disable-next-line sonarjs/argument-type
                    if (!propertiesToIgnore.includes(property)) {
                        console.log(
                            `[${objectName}] - CALL`,
                            property,
                            args,
                            `-->`,
                            result,
                        );
                    }

                    return result;
                };
            } else {
                // eslint-disable-next-line sonarjs/argument-type
                if (!propertiesToIgnore.includes(property)) {
                    console.log(
                        `[${objectName}] - GET`,
                        property,
                        '-->',
                        targetValue,
                    );
                }

                return targetValue;
            }
        },
    };

    return handler;
}

/**
 * Register a proxy around an instance of an object.
 * @param object The object to spy on.
 * @param objectName A name to be printed to the console.
 */
export function registerProxy<T>(
    object: T,
    objectName: string,
    propertiesToIgnore: string[] = [],
): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
    const prototype = Object.create(Object.getPrototypeOf(object));
    Object.setPrototypeOf(
        object,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        new Proxy(
            prototype,
            createProxyHandler(objectName, propertiesToIgnore),
        ),
    );

    console.log(`Registered proxy for ${objectName}.`);
}

/**
 * Wrap all APIs exposed by Spicetify.Platform with a proxy.
 */
export function registerPlatformProxies(
    propertiesToIgnore: string[] = [],
): void {
    for (const [name, api] of Object.entries(Spicetify.Platform as Platform)) {
        registerProxy(api, name, propertiesToIgnore);
    }
}

export function registerServicesProxies(
    propertiesToIgnore: string[] = [],
): void {
    const servicesMap = new Map<string, unknown>();

    for (const [platformName, platformApi] of Object.entries(
        Spicetify.Platform as Platform,
    )) {
        for (const [name, service] of Object.entries(
            platformApi as Record<string, unknown>,
        ).filter(([n, s]) => n.startsWith('_'))) {
            const fullName = `${platformName}.${name}`;
            if (!servicesMap.has(name)) {
                servicesMap.set(name, service);
                try {
                    registerProxy(service, fullName, propertiesToIgnore);
                } catch {}
            }
        }
    }

    console.log(servicesMap);
}

export function registerProxyMenuItem(): void {
    new Spicetify.ContextMenu.Item(
        'Register platform proxies',
        () => {
            registerPlatformProxies(['resolve', 'resolveImpl']);
        },
        () => true,
    ).register();
}
