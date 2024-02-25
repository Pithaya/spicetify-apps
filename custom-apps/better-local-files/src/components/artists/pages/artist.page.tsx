import React from 'react';
import { navigateTo } from '../../../helpers/history-helper';
import { ArtistTrackList } from '../track-list/artist-track-list';
import { Header, HeaderImage } from '../../shared/header';
import type { Artist } from 'custom-apps/better-local-files/src/models/artist';
import { getTranslation } from 'custom-apps/better-local-files/src/helpers/translations-helper';
import { getPlatformApiOrThrow } from '@shared/utils/spicetify-utils';
import { ARTISTS_ROUTE } from 'custom-apps/better-local-files/src/constants/constants';
import type { History } from '@shared/platform/history';

type Props = {
    artist: Artist;
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
    const history = getPlatformApiOrThrow<History>('History');

    const artistUri = (history.location.state as any).uri ?? null;

    if (artistUri === null) {
        history.replace(ARTISTS_ROUTE);
        return <></>;
    }

    const artists = window.localTracksService.getArtists();

    if (!artists.has(artistUri)) {
        navigateTo(ARTISTS_ROUTE);
        return <></>;
    }

    const artist = artists.get(artistUri)!;

    const artistTracks = window.localTracksService.getArtistTracks(artist.uri);

    return (
        <>
            {artist !== null && (
                <>
                    <ArtistHeader artist={artist} />
                    <ArtistTrackList tracks={artistTracks} artist={artist} />
                </>
            )}
        </>
    );
}
