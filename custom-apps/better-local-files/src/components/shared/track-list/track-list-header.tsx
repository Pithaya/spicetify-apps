import React from 'react';
import type { TrackListHeaderOption } from 'custom-apps/better-local-files/src/models/track-list-header-option';
import type { SelectedSortOption } from 'custom-apps/better-local-files/src/models/sort-option';
import { CaretUp } from '../icons/caret-up';
import { CaretDown } from '../icons/caret-down';
import type { HeaderKey } from 'custom-apps/better-local-files/src/constants/constants';
import { getTranslation } from 'custom-apps/better-local-files/src/helpers/translations-helper';
import { TextComponent } from '../text/text';

export type Props = {
    headers: TrackListHeaderOption[];
    sortedHeader?: SelectedSortOption;
    onHeaderClicked?: (key: HeaderKey) => void;
};

// TODO: responsive

export function TrackListHeader(props: Readonly<Props>): JSX.Element {
    function getCaret(): JSX.Element {
        if (props.sortedHeader === undefined) {
            return <></>;
        }

        return props.sortedHeader.order === 'ascending' ? (
            <CaretUp className="main-trackList-arrow" />
        ) : (
            <CaretDown className="main-trackList-arrow" />
        );
    }

    const sortableClass =
        props.sortedHeader !== undefined ? 'main-trackList-sortable' : '';

    return (
        <div className={`main-trackList-trackListHeader`}>
            <div
                className="main-trackList-trackListHeaderRow main-trackList-trackListRowGrid"
                aria-rowindex={1}
            >
                <div
                    className="main-trackList-rowSectionIndex"
                    aria-colindex={1}
                    aria-sort="none"
                    tabIndex={-1}
                >
                    #
                </div>

                {props.headers.map((header, index) => (
                    <div
                        key={header.key}
                        className={
                            index === 0
                                ? 'main-trackList-rowSectionStart'
                                : 'main-trackList-rowSectionVariable'
                        }
                        aria-colindex={index + 2}
                        aria-sort={
                            props.sortedHeader &&
                            props.sortedHeader.key === header.key
                                ? props.sortedHeader.order
                                : 'none'
                        }
                        tabIndex={-1}
                    >
                        <button
                            className={`main-trackList-column ${sortableClass}`}
                            tabIndex={-1}
                            onClick={() => {
                                props.onHeaderClicked?.(header.key);
                            }}
                        >
                            <TextComponent variant="mesto">
                                {header.label}
                            </TextComponent>

                            {props.sortedHeader &&
                                props.sortedHeader.key === header.key &&
                                getCaret()}
                        </button>
                    </div>
                ))}

                <div
                    className="main-trackList-rowSectionEnd"
                    aria-colindex={props.headers.length + 2}
                    aria-sort="none"
                    tabIndex={-1}
                >
                    <button
                        aria-label={getTranslation([
                            'tracklist.header.duration',
                        ])}
                        className={`main-trackList-column main-trackList-durationHeader ${sortableClass}`}
                        onClick={() => {
                            props.onHeaderClicked?.('duration');
                        }}
                    >
                        <svg
                            height="16"
                            width="16"
                            aria-hidden="true"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                        >
                            <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8z"></path>
                            <path d="M8 3.25a.75.75 0 01.75.75v3.25H11a.75.75 0 010 1.5H7.25V4A.75.75 0 018 3.25z"></path>
                        </svg>
                    </button>
                    {props.sortedHeader &&
                        props.sortedHeader.key === 'duration' &&
                        getCaret()}
                </div>
            </div>
        </div>
    );
}
