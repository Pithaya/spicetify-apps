import { getTrack } from '@shared/api/endpoints/tracks/get-track';
import type { Session } from '@shared/platform/session';
import {
    waitForPlatformApi,
    waitForSpicetify,
} from '@shared/utils/spicetify-utils';
import { registerLocale } from 'i18n-iso-countries';
import * as enLocale from 'i18n-iso-countries/langs/en.json';
import * as frLocale from 'i18n-iso-countries/langs/fr.json';
import i18next from 'i18next';
import { EarthLock } from 'lucide-react';
import React from 'react';
import { WorldMap } from './components/WorldMap/WorldMap';

async function showAvailability(uris: string[], locale: string): Promise<void> {
    const track = await getTrack({ uri: uris[0] });

    Spicetify.PopupModal.display({
        title: i18next.t('modalTitle'),
        content: (
            <WorldMap
                trackMarkets={track?.available_markets ?? []}
                locale={locale}
            />
        ),
        isLarge: true,
    });
}

function isSingleTrack(uris: string[]): boolean {
    return uris.length === 1 && Spicetify.URI.isTrack(uris[0]);
}

async function main(): Promise<void> {
    await waitForSpicetify();

    // Wait for the locale to be loaded
    await waitForPlatformApi<Session>('Session');

    const locale: typeof Spicetify.Locale = Spicetify.Locale;

    await i18next.init({
        lng: locale.getLocale(),
        fallbackLng: 'en',
        debug: false,
        resources: {
            en: {
                translation: {
                    showAvailability: 'Show availability',
                    modalTitle: 'Availability map',
                },
            },
            fr: {
                translation: {
                    showAvailability: 'Voir la disponibilité',
                    modalTitle: 'Carte des disponibilités',
                },
            },
        },
    });

    registerLocale(enLocale);
    registerLocale(frLocale);

    const menuItem = new Spicetify.ContextMenu.Item(
        i18next.t('showAvailability'),
        (uris) => {
            void showAvailability(uris, locale.getLocale());
        },
        isSingleTrack,
        <EarthLock size={16} color="var(--text-subdued)" strokeWidth={1} />,
        false,
    );

    menuItem.register();
}

export default main;
