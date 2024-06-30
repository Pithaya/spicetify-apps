import { useEffect, useState, type RefObject } from 'react';

export function useIntersectionObserver(
    elementRef: RefObject<HTMLElement>,
): boolean {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const options = {
            rootMargin: '0px',
            threshold: 0,
        };

        const observer = new IntersectionObserver((entries, observer) => {
            setVisible(entries.some((e) => e.isIntersecting));
        }, options);
        observer.observe(elementRef.current!);

        return () => {
            observer.disconnect();
        };
    }, [elementRef]);

    return visible;
}
