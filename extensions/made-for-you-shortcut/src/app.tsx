import { NavBarLink } from '@shared/components/navbar/NavBarLink';
import { waitForSpicetify } from '@shared/utils/spicetify-utils';
import { waitForElement } from '@shared/utils/dom-utils';
import i18next from 'i18next';
import { Crown } from 'lucide-react';
import React from 'react';
import { renderElement } from '@shared/utils/react-utils';
import { getSdkClient } from '@shared/utils/web-api-utils';
import type { Categories, MaxInt } from '@spotify-web-api';

async function main(): Promise<void> {
    await waitForSpicetify();

    const sdk = getSdkClient();

    // Legacy id, works but navigation link is not shown as active when on page
    let genreId: string = 'made-for-x-hub';

    let result: Categories | null = null;
    const limit: MaxInt<50> = 10;
    let offset = 0;

    do {
        result = await sdk.browse.getCategories('en_US', limit, offset);

        if (result === null) {
            break;
        }

        const madeForYouCategory = result.categories.items.find(
            (category) => category.name === 'Made For You',
        );

        if (madeForYouCategory !== undefined) {
            genreId = madeForYouCategory.id;
            break;
        }

        // Get the next page
        offset += limit;
    } while (result?.categories.next);

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

    renderElement(
        <NavBarLink
            icon={<Crown size={24} className="made-for-you-icon home-icon" />}
            activeIcon={
                <Crown
                    size={24}
                    fill="currentColor"
                    className="made-for-you-icon home-active-icon"
                />
            }
            label={i18next.t('forYou')}
            href={`/genre/${genreId}`}
        />,
        element,
    );
}

export default main;
