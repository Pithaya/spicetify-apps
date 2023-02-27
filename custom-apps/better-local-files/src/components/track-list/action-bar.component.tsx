import styles from '../../css/app.module.scss';
import React from 'react';
import { Play, Search } from 'lucide-react';

export interface IProps {
    onPlayClicked: () => void;
    searchText: string;
    onSearchChanged: (value: string) => void;
}

export function ActionBar(props: IProps) {
    return (
        <>
            <div className={`${styles['action-bar']}`}>
                <button
                    className={styles['play-button']}
                    aria-label="Lecture"
                    onClick={props.onPlayClicked}
                >
                    <Play
                        fill="var(--spice-main)"
                        stroke="var(--spice-main)"
                    ></Play>
                </button>

                <div className={styles['controls']}>
                    <div
                        className={styles['search-container']}
                        role="search"
                        aria-expanded="false"
                    >
                        <div className={styles['search-icon']}>
                            <Search size={18}></Search>
                        </div>

                        <input
                            role="searchbox"
                            maxLength={80}
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck="false"
                            placeholder="Rechercher"
                            aria-hidden="true"
                            tabIndex={-1}
                            value={props.searchText}
                            onChange={(e) =>
                                props.onSearchChanged(e.target.value)
                            }
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
