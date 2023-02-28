import { LocalFilesApi, LocalTrack } from '@shared';
import { Folder } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Header } from '../../shared/header';
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
            <Header
                image={<Folder fill="var(--spice-text)" size={100}></Folder>}
                title={'Local files'}
                additionalText={
                    <>
                        <p>Fichiers de votre ordinateur</p>
                        <p>{tracks.length} titres</p>
                    </>
                }
            />
            <TrackList tracks={tracks} />
        </>
    );
}
