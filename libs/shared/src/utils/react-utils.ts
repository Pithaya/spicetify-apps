/**
 * Render a React element in a DOM element.
 * @param element React element to render.
 * @param container DOM element to render in.
 */
export function renderElement(
    element: React.ReactNode,
    container: Element,
): void {
    const root = Spicetify.ReactDOM.createRoot(document.createElement('div'));
    const portal = Spicetify.ReactDOM.createPortal(element, container);
    root.render(portal);
}
