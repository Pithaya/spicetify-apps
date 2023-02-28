import styles from '../../../css/app.module.scss';
import React from 'react';
import { CaretDown } from '../../shared/icons/caret-down';
import { CaretUp } from '../../shared/icons/caret-up';
import { IProps as SortProps } from '../../tracks/menus/sort-menu';

export interface IProps extends SortProps {}

// TODO: i18n
// TODO: aria sort

export function TrackListHeader(props: IProps) {
    function getCaret() {
        return props.selectedSortOption.order === 'asc' ? (
            <CaretUp className="main-trackList-arrow" />
        ) : (
            <CaretDown className="main-trackList-arrow" />
        );
    }

    return (
        <div
            className={`${styles.upper} main-trackList-trackListHeader`}
            role="presentation"
        >
            <div
                className="main-trackList-trackListHeaderRow main-trackList-trackListRowGrid"
                role="row"
                aria-rowindex={1}
            >
                <div
                    className="main-trackList-rowSectionIndex"
                    role="columnheader"
                    aria-colindex={1}
                    aria-sort="none"
                    tabIndex={-1}
                >
                    #
                </div>
                <div
                    className="main-trackList-rowSectionStart"
                    role="columnheader"
                    aria-colindex={2}
                    aria-sort="none"
                    tabIndex={-1}
                >
                    <button
                        className="main-trackList-column main-trackList-sortable"
                        tabIndex={-1}
                    >
                        <span
                            className="standalone-ellipsis-one-line"
                            data-encore-id="type"
                        >
                            titre
                        </span>
                        {(props.selectedSortOption.key === 'name' ||
                            props.selectedSortOption.key === 'artist') &&
                            getCaret()}
                    </button>
                </div>
                <div
                    className="main-trackList-rowSectionVariable"
                    role="columnheader"
                    aria-colindex={3}
                    aria-sort="none"
                    tabIndex={-1}
                >
                    <button
                        className="main-trackList-column main-trackList-sortable"
                        tabIndex={-1}
                    >
                        <span
                            className="standalone-ellipsis-one-line"
                            data-encore-id="type"
                        >
                            album
                        </span>
                        {props.selectedSortOption.key === 'album' && getCaret()}
                    </button>
                </div>
                <div
                    className="main-trackList-rowSectionVariable"
                    role="columnheader"
                    aria-colindex={4}
                    aria-sort="descending"
                    tabIndex={-1}
                >
                    <button
                        className="main-trackList-column main-trackList-sortable"
                        tabIndex={-1}
                    >
                        <span
                            className="standalone-ellipsis-one-line"
                            data-encore-id="type"
                        >
                            Ajouté le
                        </span>
                        {props.selectedSortOption.key === 'date' && getCaret()}
                    </button>
                </div>
                <div
                    className="main-trackList-rowSectionEnd"
                    role="columnheader"
                    aria-colindex={5}
                    aria-sort="none"
                    tabIndex={-1}
                >
                    <div
                        aria-label="durée"
                        className="main-trackList-column main-trackList-durationHeader"
                    >
                        <svg
                            role="img"
                            height="16"
                            width="16"
                            aria-hidden="true"
                            viewBox="0 0 16 16"
                            data-encore-id="icon"
                            fill="var(--spice-subtext)"
                        >
                            <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8z"></path>
                            <path d="M8 3.25a.75.75 0 01.75.75v3.25H11a.75.75 0 010 1.5H7.25V4A.75.75 0 018 3.25z"></path>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
