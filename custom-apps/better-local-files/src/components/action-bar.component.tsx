import styles from '../css/app.module.scss';
import React from 'react';
import { Play, Search } from 'lucide-react';
import { LocalTrack } from '@shared';

export interface IProps {
    tracks: LocalTrack[];
}

export function ActionBar(props: IProps) {
    function play() {
        (Spicetify.Player as any).origin.play(
            {
                uri: 'spotify:internal:local-files',
                pages: [{ items: props.tracks }],
            },
            {},
            {
                /*
                skipTo: {
                    //uid: 1,
                    uri: 'spotify:local:Melodic+Taste:Anime+Song+Orchestra+I:Moon+Signal:267',
                    //index: 1,
                },*/
            }
        );
    }

    return (
        <>
            <div className={`${styles['action-bar']} ${styles.padded}`}>
                <button
                    className={styles['play-button']}
                    aria-label="Lecture"
                    onClick={play}
                >
                    <Play
                        fill="var(--spice-main)"
                        stroke="var(--spice-main)"
                    ></Play>
                </button>

                <div>
                    <div
                        className={styles['search-container']}
                        role="search"
                        aria-expanded="false"
                    >
                        <Spicetify.ReactComponent.TooltipWrapper
                            label="Rechercher"
                            showDelay={200}
                        >
                            <button className={styles['search-button']}>
                                <Search size={18}></Search>
                            </button>
                        </Spicetify.ReactComponent.TooltipWrapper>
                        <input
                            role="searchbox"
                            maxLength={80}
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck="false"
                            placeholder="Rechercher"
                            aria-hidden="true"
                            tabIndex={-1}
                            value=""
                        />
                    </div>

                    <button
                        className="x-sortBox-sortDropdown"
                        type="button"
                        aria-expanded="false"
                    >
                        <span data-encore-id="type">Date d'ajout</span>
                        <svg
                            role="img"
                            height="16"
                            width="16"
                            aria-hidden="true"
                            className="Svg-sc-ytk21e-0 uPxdw SbDHY3fVADNJ4l9qOLQ2"
                            viewBox="0 0 16 16"
                            data-encore-id="icon"
                        >
                            <path d="M14 6l-6 6-6-6h12z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </>
    );
}
