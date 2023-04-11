import { getTranslation } from '../helpers/translations-helper';
import { TopBarItem } from '../models/top-bar-item';

const CUSTOM_APP_PATH = '/better-local-files';

export class Routes {
    static album = `${CUSTOM_APP_PATH}/album`;
    static albums = `${CUSTOM_APP_PATH}/albums`;

    static artist = `${CUSTOM_APP_PATH}/artist`;
    static artists = `${CUSTOM_APP_PATH}/artists`;

    static tracks = `${CUSTOM_APP_PATH}`;
}

export const topBarItems: TopBarItem[] = [
    {
        key: 'Tracks',
        href: Routes.tracks,
        label: getTranslation(['search.title.tracks']),
    },
    {
        key: 'Albums',
        href: Routes.albums,
        label: getTranslation(['albums']),
    },
    {
        key: 'Artists',
        href: Routes.artists,
        label: getTranslation(['artists']),
    },
];

export type HeaderKey = 'title' | 'artist' | 'album' | 'date' | 'duration';
