import { type Folder, type Playlist } from '@shared/platform/rootlist';
import { getPlatform } from './spicetify-utils';

function isFolder(item: Folder | Playlist): item is Folder {
    return item.type === 'folder';
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

    const rootlistFolder = await rootlistAPI.getContents();

    const flattenItems = (items: (Playlist | Folder)[]): Playlist[] =>
        items.flatMap((i) => (isFolder(i) ? flattenItems(i.items) : [i]));

    let playlists: Playlist[] = flattenItems(rootlistFolder.items);

    if (filter !== undefined && filter !== '') {
        const filterLower = filter.toLowerCase();
        playlists = playlists.filter((p) =>
            p.name.toLowerCase().includes(filterLower),
        );
    }

    return playlists;
}
