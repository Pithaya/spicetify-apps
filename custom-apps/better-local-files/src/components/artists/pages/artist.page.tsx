import { History } from '@shared';
import React from 'react';
import { Routes } from '../../../constants/constants';
import { navigateTo } from '../../../helpers/history-helper';
import { ArtistTrackList } from '../track-list/artist-track-list';
import { Header, headerImageFallback } from '../../shared/header';
import { Artist } from 'custom-apps/better-local-files/src/models/artist';
import { LocalTracksService } from 'custom-apps/better-local-files/src/services/local-tracks-service';
import { getTranslation } from 'custom-apps/better-local-files/src/helpers/translations-helper';

function ArtistHeader(props: { artist: Artist }) {
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

export function ArtistPage() {
    const history = Spicetify.Platform.History as History;

    const artistUri = (history.location.state as any).uri ?? null;

    if (artistUri === null) {
        history.replace(Routes.artists);
        return <></>;
    }

    const artists = LocalTracksService.getArtists();

    if (!artists.has(artistUri)) {
        navigateTo(Routes.artists);
        return;
    }

    const artist = artists.get(artistUri)!;

    const artistTracks = LocalTracksService.getArtistTracks(artist.uri);

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
