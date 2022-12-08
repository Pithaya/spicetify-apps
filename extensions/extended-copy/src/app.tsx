import {
    Album,
    Artist,
    getAlbum,
    getArtist,
    getPlaylist,
    getShow,
    Locale,
    Playlist,
    Show,
} from '@shared';
import { Episode, getEpisode, getTrack, Track } from '@spotify-web-api';

const locale: Locale = (Spicetify as any).Locale;

async function getData(
    uriString: string
): Promise<Track | Album | Artist | Playlist | Show | Episode | null> {
    const uri: Spicetify.URI = Spicetify.URI.fromString(uriString);

    if (Spicetify.URI.isTrack(uri)) {
        return await getTrack(uri.getBase62Id());
    }

    if (Spicetify.URI.isAlbum(uri)) {
        return await getAlbum(uri);
    }

    if (Spicetify.URI.isArtist(uri)) {
        return await getArtist(uri);
    }

    if (Spicetify.URI.isPlaylistV1OrV2(uri)) {
        return await getPlaylist(uri);
    }

    if (Spicetify.URI.isShow(uri)) {
        return await getShow(uri);
    }

    if (Spicetify.URI.isEpisode(uri)) {
        return await getEpisode(uri.getBase62Id());
    }

    return null;
}

async function getName(uriString: string): Promise<string | null> {
    const uri: Spicetify.URI = Spicetify.URI.fromString(uriString);

    if (Spicetify.URI.isTrack(uri)) {
        return (await getTrack(uri.getBase62Id()))?.name ?? null;
    }

    if (Spicetify.URI.isAlbum(uri)) {
        return (await getAlbum(uri)).name;
    }

    if (Spicetify.URI.isArtist(uri)) {
        return (await getArtist(uri)).info.name;
    }

    if (Spicetify.URI.isPlaylistV1OrV2(uri)) {
        return (await getPlaylist(uri)).playlist.name;
    }

    if (Spicetify.URI.isShow(uri)) {
        return (await getShow(uri)).header.showMetadata.name;
    }

    if (Spicetify.URI.isEpisode(uri)) {
        return (await getEpisode(uri.getBase62Id()))?.name ?? null;
    }

    return null;
}

function copy(text: string | any): void {
    Spicetify.showNotification(`Copied to clipboard`);
    Spicetify.Platform.ClipboardAPI.copy(text);
}

function checkUriLength(uris: string[]): boolean {
    if (uris.length === 0) {
        Spicetify.showNotification('No element selected.', true);
        return false;
    }

    return true;
}

async function main() {
    while (!Spicetify?.Platform) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    new Spicetify.ContextMenu.SubMenu('Copy', [
        new Spicetify.ContextMenu.Item(
            'Name',
            async (uris) => {
                if (!checkUriLength(uris)) {
                    return;
                }

                const names: string[] = [];

                for (let uri of uris) {
                    const name = await getName(uri);
                    if (name === null) {
                        Spicetify.showNotification(
                            `Couldn't get name for URI '${uri}'`,
                            true
                        );
                        return;
                    } else {
                        names.push(name);
                    }
                }

                copy(names.join(locale.getSeparator()));
            },
            () => true
        ),
        new Spicetify.ContextMenu.Item(
            'ID',
            (uris) => {
                if (!checkUriLength(uris)) {
                    return;
                }

                const ids = uris.map((uri) =>
                    Spicetify.URI.fromString(uri).getBase62Id()
                );
                copy(ids.join(locale.getSeparator()));
            },
            () => true
        ),
        new Spicetify.ContextMenu.Item(
            'URI',
            (uris) => {
                if (!checkUriLength(uris)) {
                    return;
                }

                copy(uris.join(locale.getSeparator()));
            },
            () => true
        ),
        new Spicetify.ContextMenu.Item(
            'Data',
            async (uris) => {
                if (!checkUriLength(uris)) {
                    return;
                }

                const result: any[] = [];

                for (let uri of uris) {
                    const data = await getData(uri);
                    if (data === null) {
                        Spicetify.showNotification(
                            `Couldn't get data for URI '${uri}'`,
                            true
                        );
                        return;
                    } else {
                        result.push(data);
                    }
                }

                copy(result);
            },
            () => true
        ),
    ]).register();
}

export default main;
