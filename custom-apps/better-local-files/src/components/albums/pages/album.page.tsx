import { History, LocalFilesApi } from '@shared';
import React, { useEffect, useState } from 'react';
import { Routes } from '../../../constants/constants';
import { AlbumItem } from '../../../models/album-item';
import { navigateTo } from '../../../helpers/history-helper';
import { AlbumTrackList } from '../track-list/album-track-list';
import { Header } from '../../shared/header';
import { getTranslatedDuration } from 'custom-apps/better-local-files/src/helpers/translations-helper';

function AlbumHeader(props: { album: AlbumItem }) {
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
                                    draggable="false"
                                    onClick={() =>
                                        navigateTo(Routes.artist, {
                                            uri: a.uri,
                                        })
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
                        {props.album.tracks.length} titres
                    </span>
                    <span className="main-entityHeader-metaDataText">
                        {getTranslatedDuration(
                            props.album.tracks
                                .map((t) => t.duration.milliseconds)
                                .reduce((total, current) => total + current)
                        )}
                    </span>
                </>
            }
        />
    );
}

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
                    <AlbumTrackList tracks={album.tracks} />
                </>
            )}
        </>
    );
}
