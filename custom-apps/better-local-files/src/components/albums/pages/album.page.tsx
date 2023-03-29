import { History } from '@shared';
import React from 'react';
import { Routes } from '../../../constants/constants';
import { navigateTo } from '../../../helpers/history-helper';
import { AlbumTrackList } from '../track-list/album-track-list';
import { Header, headerImageFallback } from '../../shared/header';
import {
    getTranslatedDuration,
    getTranslation,
} from 'custom-apps/better-local-files/src/helpers/translations-helper';
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
                    onError={(e) =>
                        (e.currentTarget.outerHTML = headerImageFallback)
                    }
                />
            }
            subtitle={getTranslation(['album'])}
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
                        {getTranslation(
                            [
                                'tracklist-header.songs-counter',
                                props.album.getTracks().length === 1
                                    ? 'one'
                                    : 'other',
                            ],
                            props.album.getTracks().length
                        )}
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

    const albums = LocalTracksService.getAlbums();

    if (!albums.has(albumUri)) {
        navigateTo(Routes.albums);
        return;
    }

    const album = albums.get(albumUri)!;

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
