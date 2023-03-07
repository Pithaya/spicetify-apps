import React, { useEffect, useState } from 'react';
import { getTranslation } from 'custom-apps/better-local-files/src/helpers/translations-helper';
import { Track } from 'custom-apps/better-local-files/src/models/track';
import { LocalTracksService } from 'custom-apps/better-local-files/src/services/local-tracks-service';
import { Folder } from 'lucide-react';
import { Header } from '../../shared/header';
import { TrackList } from '../track-list/track-list';

export function TracksPage() {
    const [tracks, setTracks] = useState<Track[]>([]);

    useEffect(() => {
        async function getTracks() {
            const tracks = await LocalTracksService.getTracks();
            setTracks(Array.from(tracks.values()));
        }

        getTracks();
    }, []);

    return (
        <>
            <Header
                image={<Folder fill="var(--spice-text)" size={100}></Folder>}
                title={getTranslation(['local-files'])}
                titleFontSize="6rem"
                additionalText={
                    <>
                        <p>{getTranslation(['local-files.description'])}</p>
                        <p>
                            {getTranslation(
                                [
                                    'tracklist-header.songs-counter',
                                    tracks.length === 1 ? 'one' : 'other',
                                ],
                                tracks.length
                            )}
                        </p>
                    </>
                }
            />
            <TrackList tracks={tracks} />
        </>
    );
}
