class ExpectHTMLElement {
    constructor(private readonly element: HTMLElement) {}

    toHaveTextContent(text: string): void {
        if (this.element.textContent !== text) {
            throw new Error(
                `Expected "${this.element.textContent}" to be "${text}"`,
            );
        }
    }
}

class ExpectArray<T> {
    constructor(private readonly array: T[]) {}

    toHaveLength(length: number): void {
        if (this.array.length !== length) {
            throw new Error(
                `Expected array of length ${length.toFixed(0)}, got ${this.array.length.toFixed(0)}`,
            );
        }
    }
}

export function expectHtmlElement(element: HTMLElement): ExpectHTMLElement {
    return new ExpectHTMLElement(element);
}

export function expectArray<T>(array: T[]): ExpectArray<T> {
    return new ExpectArray(array);
}
