import { LocalFilesApi, LocalTrack } from '@shared';
import React, { useEffect, useState } from 'react';
import { Header } from '../header.component';
import { TrackList } from '../track-list/track-list';

export function TracksPage() {
    const api = Spicetify.Platform.LocalFilesAPI as LocalFilesApi;

    const [tracks, setTracks] = useState<LocalTrack[]>([]);

    useEffect(() => {
        async function getTracks() {
            const tracks = await api.getTracks();
            setTracks(tracks);
        }

        getTracks();
    }, []);

    return (
        <>
            <Header tracksCount={tracks.length} />
            <TrackList tracks={tracks} />
        </>
    );
}
