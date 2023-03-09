import { History } from '@shared';
import React, { useEffect, useState } from 'react';
import { Routes } from '../../../constants/constants';
import { navigateTo } from '../../../helpers/history-helper';
import { ArtistTrackList } from '../track-list/artist-track-list';
import { Header } from '../../shared/header';
import { Artist } from 'custom-apps/better-local-files/src/models/artist';
import { LocalTracksService } from 'custom-apps/better-local-files/src/services/local-tracks-service';

function ArtistHeader(props: { artist: Artist }) {
    return (
        <Header
            image={
                <img
                    src={props.artist.image}
                    alt="artist image"
                    className="main-image-image main-entityHeader-image main-entityHeader-shadow main-image-loaded"
                />
            }
            subtitle="Artiste"
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

    const [artist, setArtist] = useState<Artist | null>(null);

    const artistTracks =
        artist != null ? LocalTracksService.getArtistTracks(artist.uri) : [];

    useEffect(() => {
        async function getArtist() {
            const artists = await LocalTracksService.getArtists();

            if (!artists.has(artistUri)) {
                navigateTo(Routes.artists);
                return;
            }

            setArtist(artists.get(artistUri)!);
        }

        getArtist();
    }, []);

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
