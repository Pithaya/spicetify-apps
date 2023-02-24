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

    // TODO: createRoot + root.render() if React updates to v18
    reactDom.render(
        reactDom.createPortal(
            <NavBarLink
                icon={<Crown size={20} />}
                label={i18next.t('forYou')}
                href="/genre/made-for-x-hub"
            />,
            element
        ),
        document.createElement('div')
    );
}

export default main;
