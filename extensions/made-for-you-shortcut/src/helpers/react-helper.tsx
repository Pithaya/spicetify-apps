import { NavBarLink } from '@shared/components/nav-bar-link.component';
import { Crown } from 'lucide-react';
import React from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';

/**
 * Used to register react elements from the extension.
 * This is necessary to fix React being loaded too soon and throwing an undefined error when trying to create the elements.
 * This means that this class must be imported dynamically.
 */
export class ReactHelper {
    static registerNavBarLink(element: Element) {
        const reactDom = Spicetify.ReactDOM as typeof ReactDOM;

        // TODO: createRoot + root.render() if React updates to v18
        reactDom.render(
            reactDom.createPortal(
                <NavBarLink
                    icon={
                        <Crown
                            size={24}
                            className="made-for-you-icon home-icon"
                        />
                    }
                    activeIcon={
                        <Crown
                            size={24}
                            fill="currentColor"
                            className="made-for-you-icon home-active-icon"
                        />
                    }
                    label={i18next.t('forYou')}
                    href="/genre/made-for-x-hub"
                />,
                element
            ),
            document.createElement('div')
        );
    }
}
