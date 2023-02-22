/**
 * Wait for an element to be available in the DOM.
 * @param selector The element's selector.
 * @returns The element.
 */
export function waitForElement(selector: string): Promise<Element> {
    return new Promise<Element>((resolve) => {
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
    });
}
