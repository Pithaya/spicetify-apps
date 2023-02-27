import { useEffect, useState, RefObject } from 'react';

export function useIntersectionObserver(
    elementRef: RefObject<HTMLElement>
): boolean {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        let options = {
            rootMargin: '0px',
            threshold: 0,
        };

        let observer = new IntersectionObserver(
            (entries, observer) => setVisible(entries[0].isIntersecting),
            options
        );
        observer.observe(elementRef.current!);

        return () => {
            observer.disconnect();
        };
    }, [elementRef]);

    return visible;
}
