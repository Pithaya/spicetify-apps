import React from 'react';
import { getTranslation } from 'custom-apps/better-local-files/src/helpers/translations-helper';
import { Folder } from 'lucide-react';
import { Header } from '../../shared/header';
import { TrackList } from '../track-list/track-list';
import styles from '../../../css/app.module.scss';
import { TextComponent } from '@shared/components/ui/text/text';

export function TracksPage(): JSX.Element {
    const tracks = Array.from(window.localTracksService.getTracks().values());

    return (
        <>
            <Header
                image={
                    <div
                        className={`${styles['center-container']}`}
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
                                    tracks.length === 1 ? 'one' : 'other',
                                ],
                                tracks.length,
                            )}
                        </TextComponent>
                    </>
                }
            />

            <TrackList tracks={tracks} />
        </>
    );
}
