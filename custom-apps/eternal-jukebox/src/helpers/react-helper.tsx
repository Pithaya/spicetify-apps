import React from 'react';
import ReactDOM from 'react-dom';
import { PlaybarButton } from '../components/playbar-button.component';

/**
 * Used to register react elements from the extension.
 * This is necessary to fix React being loaded too soon and throwing an undefined error when trying to create the elements.
 * This means that this class must be imported dynamically.
 */
export class ReactHelper {
    static registerPaybarButton(element: Element) {
        const reactDom = Spicetify.ReactDOM as typeof ReactDOM;

        // TODO: createRoot + root.render() if React updates to v18
        reactDom.render(
            reactDom.createPortal(<PlaybarButton />, element),
            document.createElement('div')
        );
    }
}
