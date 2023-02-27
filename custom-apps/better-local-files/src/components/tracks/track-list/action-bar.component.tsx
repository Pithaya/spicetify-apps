import styles from '../../../css/app.module.scss';
import React from 'react';
import { Play, Search } from 'lucide-react';
import {
    IProps as SearchProps,
    SearchInput,
} from '../../shared/filters/search-input';

export interface IProps extends SearchProps {
    onPlayClicked: () => void;
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
                    <SearchInput
                        search={props.search}
                        setSearch={props.setSearch}
                        debouncedSearch={props.debouncedSearch}
                        setDebouncedSearch={props.setDebouncedSearch}
                    />

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
