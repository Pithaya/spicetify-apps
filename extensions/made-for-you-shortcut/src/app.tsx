import { waitForElement } from '@shared/utils';
import i18next from 'i18next';

async function main() {
    while (!Spicetify?.Platform) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const locale = (Spicetify as any).Locale;

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
    let styles = `
        svg.made-for-you-icon {
            stroke-width: 2px !important;
        }
    `;

    let styleSheet = document.createElement('style');
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    const reactHelper = await import('./helpers/react-helper');
    reactHelper.ReactHelper.registerNavBarLink(element);
}

export default main;
