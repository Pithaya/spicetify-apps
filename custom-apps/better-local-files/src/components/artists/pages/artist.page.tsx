import React from 'react';
import { navigateTo } from '../../../helpers/history-helper';
import { ArtistTrackList } from '../track-list/artist-track-list';
import { Header, headerImageFallback } from '../../shared/header';
import type { Artist } from 'custom-apps/better-local-files/src/models/artist';
import { getTranslation } from 'custom-apps/better-local-files/src/helpers/translations-helper';
import { getPlatform } from '@shared/utils';
import { ARTISTS_ROUTE } from 'custom-apps/better-local-files/src/constants/constants';

type Props = {
    artist: Artist;
};

function ArtistHeader(props: Readonly<Props>): JSX.Element {
    return (
        <Header
            image={
                <img
                    src={props.artist.image}
                    alt="artist image"
                    className="main-image-image main-entityHeader-image main-entityHeader-shadow main-image-loaded"
                    onError={(e) =>
                        (e.currentTarget.outerHTML = headerImageFallback)
                    }
                />
            }
            subtitle={getTranslation(['artist'])}
            title={props.artist.name}
        />
    );
}

export function ArtistPage(): JSX.Element {
    const history = getPlatform().History;

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
