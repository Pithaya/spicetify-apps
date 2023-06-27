import { useEffect, useState } from 'react';
import { Observable } from 'rxjs';

export function useObservable<T>(observable: Observable<T>, defaultValue: T) {
    const [value, setValue] = useState<T>(defaultValue);

    useEffect(() => {
        const subscription = observable.subscribe((v) => {
            setValue(v);
        });

        return () => subscription.unsubscribe();
    }, []);

    return value;
}
