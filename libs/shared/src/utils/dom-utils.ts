/**
 * Wait for an element to be available in the DOM.
 * @param selector The element's selector.
 * @param timeout The maximum waiting time, in milliseconds. If not provided, the function will keep waiting with no limits.
 * @returns The element.
 */
export function waitForElement(
    selector: string,
    timeout?: number
): Promise<Element> {
    return new Promise<Element>((resolve, reject) => {
        const element: Element | null = document.querySelector(selector);
        if (element !== null) {
            return resolve(element);
        }

        const observer = new MutationObserver(() => {
            const element: Element | null = document.querySelector(selector);
            if (element !== null) {
                resolve(element);
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        if (timeout !== undefined) {
            setTimeout(() => {
                observer.disconnect();
                reject(`Couldn't find the element "${selector}".`);
            }, timeout);
        }
    });
}
