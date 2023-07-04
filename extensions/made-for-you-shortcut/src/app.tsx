import { Locale, NavBarLink, waitForElement } from '@shared';
import i18next from 'i18next';
import { Crown } from 'lucide-react';
import React from 'react';
import ReactDOM from 'react-dom';

const locale: Locale = (Spicetify as any).Locale;

async function main() {
    while (!Spicetify?.Platform) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

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

    const reactDom = Spicetify.ReactDOM as typeof ReactDOM;

    const element = await waitForElement('#spicetify-sticky-list');

    // Prevent global changes to the stroke-width distorting the icon
    let styles = `
        svg.made-for-you-icon {
            stroke-width: 2px !important;
        }
    `;

    let styleSheet = document.createElement('style');
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // TODO: createRoot + root.render() if React updates to v18
    reactDom.render(
        reactDom.createPortal(
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
            element
        ),
        document.createElement('div')
    );
}

export default main;
