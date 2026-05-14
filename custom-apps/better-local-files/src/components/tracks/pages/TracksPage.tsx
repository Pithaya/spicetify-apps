import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { getTranslation } from '@shared/utils/translations.utils';
import { db } from 'custom-apps/better-local-files/src/db/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { Folder } from 'lucide-react';
import React from 'react';
import styles from '../../../css/app.module.scss';
import { Header } from '../../shared/Header';
import { TrackList } from '../track-list/TrackList';

export function TracksPage(): JSX.Element {
    const totalTracks = useLiveQuery(() => db.tracks.count(), [], 0);

    return (
        <>
            <Header
                image={
                    <div
                        className={styles['center-container']}
                        style={{
                            background:
                                'linear-gradient(126deg, rgba(69,8,245,1) 0%, rgba(111,86,235,1) 27%, rgba(151,159,225,1) 67%, rgba(189,228,217,1) 100%)',
                            borderRadius: '4px',
                        }}
                    >
                        <Folder fill="var(--spice-text)" size={100}></Folder>
                    </div>
                }
                title={getTranslation(['local-files'])}
                titleFontSize="6rem"
                metadata={
                    <>
                        <TextComponent
                            variant="mesto"
                            className="main-entityHeader-metaDataText"
                        >
                            {getTranslation(['local-files.description'])}
                        </TextComponent>
                        <TextComponent
                            variant="mesto"
                            className="main-entityHeader-metaDataText"
                        >
                            {getTranslation(
                                [
                                    'tracklist-header.songs-counter',
                                    totalTracks === 1 ? 'one' : 'other',
                                ],
                                totalTracks.toFixed(),
                            )}
                        </TextComponent>
                    </>
                }
            />

            <TrackList />
        </>
    );
}
