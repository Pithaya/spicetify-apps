import { getPlatform } from '@shared/utils/spicetify-utils';
import { getTranslation } from '@shared/utils/translations.utils';
import { ARTISTS_ROUTE } from 'custom-apps/better-local-files/src/constants/constants';
import { db, getArtistTracks } from 'custom-apps/better-local-files/src/db/db';
import type { CachedArtist } from 'custom-apps/better-local-files/src/models/cached-artist';
import { useLiveQuery } from 'dexie-react-hooks';
import React from 'react';
import { Header, HeaderImage } from '../../shared/Header';
import { ArtistTrackList } from '../track-list/ArtistTrackList';

type Props = {
    artist: CachedArtist;
};

function ArtistHeader(props: Readonly<Props>): JSX.Element {
    return (
        <Header
            image={<HeaderImage imageSrc={props.artist.image} />}
            subtitle={getTranslation(['artist'])}
            title={props.artist.name}
        />
    );
}

export function ArtistPage(): JSX.Element {
    const history = getPlatform().History;
    const state = history.location.state as { uri?: string };

    const artistUri = state.uri ?? null;

    const artist = useLiveQuery(async () => {
        if (artistUri === null) {
            return undefined;
        }

        return db.artists.get(artistUri);
    }, [artistUri]);

    const artistTracks = useLiveQuery(
        async () => {
            if (artistUri === null) {
                return [];
            }

            return getArtistTracks(artistUri);
        },
        [artistUri],
        [],
    );

    if (artistUri === null) {
        history.replace(ARTISTS_ROUTE);
        return <></>;
    }

    if (artist === undefined) {
        return <></>;
    }

    return (
        <>
            <ArtistHeader artist={artist} />
            <ArtistTrackList tracks={artistTracks} artist={artist} />
        </>
    );
}
