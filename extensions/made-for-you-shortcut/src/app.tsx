import { NavBarLink } from '@shared/components/nav-bar-link.component';
import { waitForElement, waitForSpicetify } from '@shared/utils';
import i18next from 'i18next';
import { Crown } from 'lucide-react';
import React from 'react';
import ReactDOM from 'react-dom';

async function main(): Promise<void> {
    await waitForSpicetify();

    const locale: typeof Spicetify.Locale = Spicetify.Locale;

    await i18next.init({
        lng: locale.getLocale(),
        fallbackLng: 'en',
        debug: false,
        resources: {
            en: {
                translation: {
                    forYou: 'Made for you',
                },
            },
            fr: {
                translation: {
                    forYou: 'Fait pour vous',
                },
            },
        },
    });

    const element = await waitForElement('#spicetify-sticky-list');

    // Prevent global changes to the stroke-width distorting the icon
    const styles = `
        svg.made-for-you-icon {
            stroke-width: 2px !important;
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    ReactDOM.render(
        ReactDOM.createPortal(
            <NavBarLink
                icon={
                    <Crown size={24} className="made-for-you-icon home-icon" />
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
            element,
        ),
        document.createElement('div'),
    );
}

export default main;
