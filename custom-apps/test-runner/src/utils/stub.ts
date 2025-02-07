export function stub<T extends object>(
    target: T,
    key: keyof T,
    value: T[keyof T],
): () => void {
    const prototype = Object.create(Object.getPrototypeOf(target));

    const { proxy, revoke } = Proxy.revocable(prototype, {
        get(target, property, receiver) {
            if (property === key) {
                return value;
            }

            return Reflect.get(target, property, receiver);
        },
    });

    Object.setPrototypeOf(target, proxy);

    return () => {
        Object.setPrototypeOf(target, prototype);
        revoke();
    };
}
