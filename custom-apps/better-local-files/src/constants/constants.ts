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
        label: 'Tracks',
    },
    {
        key: 'Albums',
        href: Routes.albums,
        label: 'Albums',
    },
    {
        key: 'Artists',
        href: Routes.artists,
        label: 'Artists',
    },
];

export type HeaderKey = 'title' | 'album' | 'date' | 'duration';
