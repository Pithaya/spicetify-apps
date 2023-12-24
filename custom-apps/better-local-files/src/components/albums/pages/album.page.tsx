import React from 'react';
import { navigateTo } from '../../../helpers/history-helper';
import { AlbumTrackList } from '../track-list/album-track-list';
import { Header, HeaderImage } from '../../shared/header';
import {
    getTranslatedDuration,
    getTranslation,
} from 'custom-apps/better-local-files/src/helpers/translations-helper';
import type { Album } from 'custom-apps/better-local-files/src/models/album';
import { getPlatform } from '@shared/utils';
import {
    ALBUMS_ROUTE,
    ARTIST_ROUTE,
} from 'custom-apps/better-local-files/src/constants/constants';
import { TextComponent } from '../../shared/text/text';

type Props = {
    album: Album;
};

function AlbumHeader(props: Readonly<Props>): JSX.Element {
    return (
        <Header
            image={<HeaderImage imageSrc={props.album.image} />}
            subtitle={getTranslation(['album'])}
            title={props.album.name}
            metadata={
                <>
                    {props.album.artists
                        .map((a) => (
                            <TextComponent variant="mestoBold" key={a.uri}>
                                <a
                                    href="#"
                                    draggable="false"
                                    onClick={() => {
                                        navigateTo(ARTIST_ROUTE, a.uri);
                                    }}
                                >
                                    {a.name}
                                </a>
                            </TextComponent>
                        ))
                        .reduce(
                            (
                                accu: JSX.Element[] | null,
                                elem: JSX.Element,
                                index: number,
                            ) => {
                                return accu === null
                                    ? [elem]
                                    : [
                                          ...accu,
                                          <span
                                              key={index}
                                              className="main-entityHeader-divider"
                                          ></span>,
                                          elem,
                                      ];
                            },
                            null,
                        )}
                    <TextComponent
                        variant="mesto"
                        className="main-entityHeader-metaDataText"
                    >
                        {getTranslation(
                            [
                                'tracklist-header.songs-counter',
                                props.album.getTracks().length === 1
                                    ? 'one'
                                    : 'other',
                            ],
                            props.album.getTracks().length,
                        )}
                    </TextComponent>
                    <TextComponent
                        variant="mesto"
                        className="main-entityHeader-metaDataText"
                    >
                        {getTranslatedDuration(props.album.getDuration())}
                    </TextComponent>
                </>
            }
        />
    );
}

export function AlbumPage(): JSX.Element {
    const history = getPlatform().History;

    const albumUri = (history.location.state as any).uri ?? null;

    if (albumUri === null) {
        history.replace(ALBUMS_ROUTE);
        return <></>;
    }

    const albums = window.localTracksService.getAlbums();

    if (!albums.has(albumUri)) {
        navigateTo(ALBUMS_ROUTE);
        return <></>;
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
