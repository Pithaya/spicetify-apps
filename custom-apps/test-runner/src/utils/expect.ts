export class Expect {
    constructor(private readonly element: HTMLElement) {}

    toHaveTextContent(text: string): void {
        if (this.element.textContent !== text) {
            throw new Error(
                `Expected "${this.element.textContent}" to be "${text}"`,
            );
        }
    }
}

export function expect(element: HTMLElement): Expect {
    return new Expect(element);
}
