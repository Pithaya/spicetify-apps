import { History, LocalFilesApi } from '@shared';
import React, { useEffect, useState } from 'react';
import { Routes } from '../../../constants/constants';
import { AlbumItem } from '../../../models/album-item';
import { AlbumHeader } from '../../album-header.component';
import { navigateTo } from '../../../helpers/history-helper';
import { TrackList } from '../../tracks/track-list/track-list';

export function AlbumPage() {
    const api = Spicetify.Platform.LocalFilesAPI as LocalFilesApi;
    const history = Spicetify.Platform.History as History;

    const albumUri = (history.location.state as any).uri ?? null;

    if (albumUri === null) {
        history.replace(Routes.albums);
        return <></>;
    }

    const [album, setAlbum] = useState<AlbumItem | null>(null);

    useEffect(() => {
        async function getTracks() {
            const tracks = await api.getTracks();

            const album = tracks.find((a) => a.album.uri === albumUri)?.album;

            if (album === undefined) {
                navigateTo(Routes.albums);
                return;
            }

            const albumTracks = tracks.filter(
                (a) => a.album.name === album.name
            );

            const albumItem: AlbumItem = {
                name: album.name === '' ? 'Undefined' : album.name,
                uri: album.uri,
                artists: [],
                image: albumTracks[0].album.images[0].url,
                tracks: albumTracks,
            };

            for (const track of albumTracks) {
                for (const artist of track.artists) {
                    if (!albumItem.artists.some((a) => a.uri === artist.uri)) {
                        albumItem.artists.push(artist);
                    }
                }
            }

            setAlbum(albumItem);
        }

        getTracks();
    }, []);

    return (
        <>
            {album !== null && (
                <>
                    <AlbumHeader album={album} />
                    <TrackList tracks={album.tracks} />
                </>
            )}
        </>
    );
}
