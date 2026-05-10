import { IconNavLink } from '@shared/components/navbar/IconNavLink';
import { NavBarLink } from '@shared/components/navbar/NavBarLink';
import { home } from '@shared/graphQL/queries/home';
import { waitForElement } from '@shared/utils/dom-utils';
import { renderElement } from '@shared/utils/react-utils';
import { getPlatform, waitForSpicetify } from '@shared/utils/spicetify-utils';
import { getTranslation } from '@shared/utils/translations.utils';
import { Crown } from 'lucide-react';
import React from 'react';

async function main(): Promise<void> {
    await waitForSpicetify();

    const username = getPlatform().username;

    const { home: homeData } = await home();

    const madeForYouSection = homeData.sectionContainer.sections.items.find(
        (section) =>
            section.data.__typename !== 'HomeShortsSectionData' &&
            section.data.title.transformedLabel.includes(username),
    );

    if (madeForYouSection === undefined) {
        return;
    }

    const sectionId = madeForYouSection.uri.split(':').pop();

    if (sectionId === undefined || sectionId === '') {
        return;
    }

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
                label={getTranslation([
                    'keyboard.shortcuts.description.madeForYour',
                ])}
                href={`/section/${sectionId}`}
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
                label={getTranslation([
                    'keyboard.shortcuts.description.madeForYour',
                ])}
                href={`/section/${sectionId}`}
            />,
            element,
        );
    }
}

export default main;
