import { getCategories } from '@shared/api/endpoints/browse/get-categories';
import type { Category } from '@shared/api/models/category';
import type { Page } from '@shared/api/models/page';
import { IconNavLink } from '@shared/components/navbar/IconNavLink';
import { NavBarLink } from '@shared/components/navbar/NavBarLink';
import { waitForElement } from '@shared/utils/dom-utils';
import { renderElement } from '@shared/utils/react-utils';
import { waitFor, waitForSpicetify } from '@shared/utils/spicetify-utils';
import i18next from 'i18next';
import { Crown } from 'lucide-react';
import React from 'react';

async function main(): Promise<void> {
    await waitForSpicetify();
    await waitFor(() => Spicetify.CosmosAsync);
    await waitFor(() => Spicetify.ReactDOM);

    // Legacy id, works but navigation link is not shown as active when on page
    let genreId: string = 'made-for-x-hub';

    let result: Page<Category> | null = null;
    const limit: number = 10;
    let offset = 0;

    do {
        result = await getCategories({ limit, offset });

        if (result === null) {
            break;
        }

        const madeForYouCategory = result.items.find(
            (category) => category.name === 'Made For You',
        );

        if (madeForYouCategory !== undefined) {
            genreId = madeForYouCategory.id;
            break;
        }

        // Get the next page
        offset += limit;
    } while (result?.next);

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

    // Prevent global changes to the stroke-width distorting the icon
    const styles = `
        svg.made-for-you-icon {
            stroke-width: 2px !important;
        }

        button.made-for-you-button:focus-visible {
            border-width: 2px;
            border-style: solid;
        }

        button.made-for-you-button:focus::after {
            border-color: transparent !important;
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    try {
        // Legacy nav bar
        const element = await waitForElement('#spicetify-sticky-list', 2000);

        renderElement(
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
                href={`/genre/${genreId}`}
            />,
            element,
        );
    } catch {
        // Couldn't find the container element : new navbar
        const element = await waitForElement(
            '.custom-navlinks-scrollable_container div[role="presentation"]',
        );

        renderElement(
            <IconNavLink
                icon={<Crown size={24} className="made-for-you-icon" />}
                activeIcon={
                    <Crown
                        size={24}
                        fill="currentColor"
                        className="made-for-you-icon"
                    />
                }
                className="made-for-you-button"
                label={i18next.t('forYou')}
                href={`/genre/${genreId}`}
            />,
            element,
        );
    }
}

export default main;
