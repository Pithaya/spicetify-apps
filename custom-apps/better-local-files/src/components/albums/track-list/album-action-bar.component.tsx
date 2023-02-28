import styles from '../../../css/app.module.scss';
import React from 'react';
import { IProps as SearchProps } from '../../shared/filters/search-input';
import { PlayButton } from '../../shared/buttons/play-button';

export interface IProps extends SearchProps {
    onPlayClicked: () => void;
}

export function AlbumActionBar(props: IProps) {
    return (
        <>
            <div className={`${styles['album__action-bar']}`}>
                <PlayButton
                    size={60}
                    iconSize={24}
                    onClick={props.onPlayClicked}
                />

                <button
                    type="button"
                    aria-haspopup="menu"
                    aria-label="Plus d'options pour Catherine &amp; Catherine Full Body Soundtrack Set"
                    className="main-moreButton-button"
                    aria-expanded="false"
                >
                    <svg
                        role="img"
                        height="32"
                        width="32"
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        data-encore-id="icon"
                        fill="currentColor"
                    >
                        <path d="M4.5 13.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm15 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm-7.5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                    </svg>
                </button>
            </div>
        </>
    );
}
