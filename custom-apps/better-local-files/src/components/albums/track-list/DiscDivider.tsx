import { getTranslation } from 'custom-apps/better-local-files/src/utils/translations.utils';
import React from 'react';

type Props = {
    discNumber: number;
};

export function DiscDivider(props: Readonly<Props>): JSX.Element {
    return (
        <div className="main-trackList-trackListRowGrid main-trackList-discRow">
            <div
                className="main-trackList-rowSectionIndex"
                aria-colindex={1}
                tabIndex={-1}
            >
                <div className="main-trackList-rowMarker">
                    <span className="main-trackList-icon">
                        <svg
                            height="16"
                            width="16"
                            aria-hidden="true"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                        >
                            <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"></path>
                            <path d="M8 6.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM5 8a3 3 0 1 1 6 0 3 3 0 0 1-6 0z"></path>
                        </svg>
                    </span>
                </div>
            </div>
            <div
                className="main-trackList-rowSectionStart"
                aria-colindex={2}
                tabIndex={-1}
            >
                <div className="main-trackList-rowMainContent">
                    <div
                        dir="auto"
                        className="main-trackList-rowTitle main-trackList-discTitle standalone-ellipsis-one-line"
                    >
                        {getTranslation(
                            ['tracklist.disc-sperator.title'],
                            props.discNumber,
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
