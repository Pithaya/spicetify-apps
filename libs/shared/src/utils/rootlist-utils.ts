import { type Folder, type Playlist } from '@shared/platform/rootlist';
import { getPlatform } from './spicetify-utils';

function isFolder(item: Folder | Playlist): item is Folder {
    return item.type === 'folder';
}

function isPlaylist(item: Folder | Playlist): item is Playlist {
    return item.type === 'playlist';
}

export async function getRootlistFolders(): Promise<Folder[]> {
    const rootlistAPI = getPlatform().RootlistAPI;

    const rootlistFolder = await rootlistAPI.getContents();

    const flattenItems = (items: (Playlist | Folder)[]): Folder[] =>
        items.filter(isFolder).flatMap((i) => [i, ...flattenItems(i.items)]);

    const folders: Folder[] = flattenItems(rootlistFolder.items);
    return folders;
}

export async function getRootlistPlaylists(
    filter?: string,
): Promise<Playlist[]> {
    const rootlistAPI = getPlatform().RootlistAPI;

    const rootlistFolder = await rootlistAPI.getContents({
        flatten: true,
        filter,
    });

    const playlists: Playlist[] = rootlistFolder.items.filter(isPlaylist);
    return playlists;
}
