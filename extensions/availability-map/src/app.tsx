import React from 'react';
import { waitForSpicetify } from '@shared/utils/spicetify-utils';
import i18next from 'i18next';
import { EarthLock } from 'lucide-react';
import { getMarkets } from '@spotify-web-api/api/api.markets';
import { getTrack } from '@spotify-web-api/api/api.tracks';
import { WorldMap } from './components/WorldMap/WorldMap';
import { getId } from '@shared/utils/uri-utils';

async function showAvailability(
    uris: string[],
    allMarkets: string[],
): Promise<void> {
    const uri: Spicetify.URI = Spicetify.URI.fromString(uris[0]);
    const id = getId(uri);

    if (id === null) {
        return;
    }

    const track = await getTrack(id);

    Spicetify.PopupModal.display({
        title: 'Availability Map',
        content: (
            <WorldMap
                trackMarkets={track?.available_markets ?? []}
                allMarkets={allMarkets}
            />
        ) as any,
        isLarge: true,
    });
}

function isTrack(uris: string[]): boolean {
    const uri: Spicetify.URI = Spicetify.URI.fromString(uris[0]);

    if (uri.type === Spicetify.URI.Type.TRACK) {
        return true;
    }

    return false;
}

async function main(): Promise<void> {
    await waitForSpicetify();

    const allMarkets = await getMarkets();

    const locale: typeof Spicetify.Locale = Spicetify.Locale;

    await i18next.init({
        lng: locale.getLocale(),
        fallbackLng: 'en',
        debug: false,
        resources: {
            en: {
                translation: {
                    showAvailability: 'Show availability',
                },
            },
            fr: {
                translation: {
                    showAvailability: 'Voir la disponibilité',
                },
            },
        },
    });

    const menuItem = new Spicetify.ContextMenu.Item(
        i18next.t('showAvailability'),
        async (uris) => {
            await showAvailability(uris, allMarkets?.markets ?? []);
        },
        isTrack,
        Spicetify.ReactDOMServer.renderToString(
            <EarthLock size={16} color="var(--text-subdued)" strokeWidth={1} />,
        ),
        false,
    );

    menuItem.register();
}

export default main;
