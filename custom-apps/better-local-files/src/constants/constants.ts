import type { TopBarItem } from '@shared/components/top-bar/top-bar-item';
import { getTranslation } from '@shared/utils/translations.utils';

export const CUSTOM_APP_PATH = '/better-local-files';
export const ALBUM_ROUTE = `${CUSTOM_APP_PATH}/album`;
export const ALBUMS_ROUTE = `${CUSTOM_APP_PATH}/albums`;

export const ARTIST_ROUTE = `${CUSTOM_APP_PATH}/artist`;
export const ARTISTS_ROUTE = `${CUSTOM_APP_PATH}/artists`;

export const TRACKS_ROUTE = CUSTOM_APP_PATH;

export const topBarItems: TopBarItem[] = [
    {
        key: 'Tracks',
        href: TRACKS_ROUTE,
        label: getTranslation(['search.title.tracks']),
    },
    {
        key: 'Albums',
        href: ALBUMS_ROUTE,
        label: getTranslation(['search.title.albums']),
    },
    {
        key: 'Artists',
        href: ARTISTS_ROUTE,
        label: getTranslation(['search.title.artists']),
    },
];
