import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { getPlatform } from '@shared/utils/spicetify-utils';
import {
    getTranslatedDuration,
    getTranslation,
} from '@shared/utils/translations.utils';
import {
    ALBUMS_ROUTE,
    ARTIST_ROUTE,
} from 'custom-apps/better-local-files/src/constants/constants';
import { db } from 'custom-apps/better-local-files/src/db/db';
import type { CachedAlbum } from 'custom-apps/better-local-files/src/models/cached-album';
import type { CachedTrack } from 'custom-apps/better-local-files/src/models/cached-track';
import { useLiveQuery } from 'dexie-react-hooks';
import React from 'react';
import { navigateTo } from '../../../utils/history.utils';
import { Header, HeaderImage } from '../../shared/Header';
import { AlbumTrackList } from '../track-list/AlbumTrackList';

type AlbumViewData = {
    album: CachedAlbum;
    discs: Map<number, CachedTrack[]>;
    totalTracks: number;
    totalDuration: number;
};

type AlbumHeaderProps = {
    album: CachedAlbum;
    image: string;
    totalTracks: number;
    totalDuration: number;
};

function AlbumHeader(props: Readonly<AlbumHeaderProps>): JSX.Element {
    return (
        <Header
            image={<HeaderImage imageSrc={props.image} />}
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
                                          <span className="tw:mx-1" key={index}>
                                              •
                                          </span>,
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
                                props.totalTracks === 1 ? 'one' : 'other',
                            ],
                            props.totalTracks.toFixed(),
                        )}
                    </TextComponent>
                    <TextComponent
                        variant="mesto"
                        className="main-entityHeader-metaDataText"
                    >
                        {getTranslatedDuration(props.totalDuration)}
                    </TextComponent>
                </>
            }
        />
    );
}

export function AlbumPage(): JSX.Element {
    const history = getPlatform().History;
    const state = history.location.state as { uri?: string };

    const albumUri = state.uri ?? null;

    const view = useLiveQuery(async (): Promise<AlbumViewData | null> => {
        if (albumUri === null) {
            return null;
        }

        const album = await db.albums.get(albumUri);
        if (album === undefined) {
            return null;
        }

        const allUris = Object.values(album.discs).flat();
        const tracks = await db.tracks.where('uri').anyOf(allUris).toArray();
        const tracksByUri = new Map<string, CachedTrack>(
            tracks.map((r) => [r.uri, r]),
        );

        const discs = new Map<number, CachedTrack[]>();
        let totalDuration = 0;
        for (const [discNumberStr, trackUris] of Object.entries(album.discs)) {
            const tracks: CachedTrack[] = [];
            for (const uri of trackUris) {
                const track = tracksByUri.get(uri);
                if (track !== undefined) {
                    tracks.push(track);
                    totalDuration += track.duration;
                }
            }
            discs.set(Number(discNumberStr), tracks);
        }

        return {
            album,
            discs,
            totalTracks: tracks.length,
            totalDuration,
        };
    }, [albumUri]);

    if (albumUri === null) {
        history.replace(ALBUMS_ROUTE);
        return <></>;
    }

    if (view === undefined || view === null) {
        return <></>;
    }

    return (
        <>
            <AlbumHeader
                album={view.album}
                image={view.album.image}
                totalTracks={view.totalTracks}
                totalDuration={view.totalDuration}
            />
            <AlbumTrackList albumName={view.album.name} discs={view.discs} />
        </>
    );
}
