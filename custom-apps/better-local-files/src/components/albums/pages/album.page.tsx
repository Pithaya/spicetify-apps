import { History } from '@shared';
import React, { useEffect, useState } from 'react';
import { Routes } from '../../../constants/constants';
import { navigateTo } from '../../../helpers/history-helper';
import { AlbumTrackList } from '../track-list/album-track-list';
import { Header } from '../../shared/header';
import { getTranslatedDuration } from 'custom-apps/better-local-files/src/helpers/translations-helper';
import { LocalTracksService } from 'custom-apps/better-local-files/src/services/local-tracks-service';
import { Album } from 'custom-apps/better-local-files/src/models/album';

function AlbumHeader(props: { album: Album }) {
    return (
        <Header
            image={
                <img
                    src={props.album.image}
                    alt="album image"
                    className="main-image-image main-entityHeader-image main-entityHeader-shadow main-image-loaded"
                />
            }
            subtitle="Album"
            title={props.album.name}
            metadata={
                <>
                    {props.album.artists
                        .map((a) => (
                            <span>
                                <a
                                    href="#"
                                    draggable="false"
                                    onClick={() =>
                                        navigateTo(Routes.artist, a.uri)
                                    }
                                >
                                    {a.name}
                                </a>
                            </span>
                        ))
                        .reduce(
                            (accu: JSX.Element[] | null, elem: JSX.Element) => {
                                return accu === null
                                    ? [elem]
                                    : [
                                          ...accu,
                                          <span className="main-entityHeader-divider"></span>,
                                          elem,
                                      ];
                            },
                            null
                        )}
                    <span className="main-entityHeader-metaDataText">
                        {props.album.getTracks().length} titres
                    </span>
                    <span className="main-entityHeader-metaDataText">
                        {getTranslatedDuration(props.album.getDuration())}
                    </span>
                </>
            }
        />
    );
}

export function AlbumPage() {
    const history = Spicetify.Platform.History as History;

    const albumUri = (history.location.state as any).uri ?? null;

    if (albumUri === null) {
        history.replace(Routes.albums);
        return <></>;
    }

    const [album, setAlbum] = useState<Album | null>(null);

    useEffect(() => {
        async function getAlbum() {
            const albums = await LocalTracksService.getAlbums();

            if (!albums.has(albumUri)) {
                navigateTo(Routes.albums);
                return;
            }

            setAlbum(albums.get(albumUri)!);
        }

        getAlbum();
    }, []);

    return (
        <>
            {album !== null && (
                <>
                    <AlbumHeader album={album} />
                    <AlbumTrackList
                        albumName={album.name}
                        discs={album.discs}
                    />
                </>
            )}
        </>
    );
}
