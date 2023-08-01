import React from 'react';
import { SettingsModal } from '../components/settings-modal.component';

/**
 * Used to register react elements from the extension.
 * This is necessary to fix React being loaded too soon and throwing an undefined error when trying to create the elements.
 * This means that this class must be imported dynamically.
 */
export class ReactHelper {
    static createSettingsModal() {
        return React.createElement(SettingsModal) as any;
    }
}
