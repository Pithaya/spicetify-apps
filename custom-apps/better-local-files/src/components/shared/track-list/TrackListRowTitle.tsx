import { ARTIST_ROUTE } from 'custom-apps/better-local-files/src/constants/constants';
import { navigateTo } from 'custom-apps/better-local-files/src/utils/history.utils';
import type { Track } from 'custom-apps/better-local-files/src/models/track';
import React from 'react';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';

type Props = {
    track: Track;
    withArtists: boolean;
};

export function TrackListRowTitle(props: Readonly<Props>): JSX.Element {
    return (
        <div className="main-trackList-rowMainContent">
            <TextComponent
                className="main-trackList-rowTitle standalone-ellipsis-one-line"
                variant="ballad"
                semanticColor="textBase"
            >
                {props.track.name}
            </TextComponent>
            {props.withArtists && (
                <TextComponent
                    className="main-trackList-rowSubTitle standalone-ellipsis-one-line"
                    variant="mesto"
                    semanticColor="textSubdued"
                >
                    {props.track.artists
                        .map((a) => (
                            <a
                                dir="auto"
                                href="#"
                                tabIndex={-1}
                                onClick={() => {
                                    navigateTo(ARTIST_ROUTE, a.uri);
                                }}
                                key={a.uri}
                            >
                                {a.name}
                            </a>
                        ))
                        .reduce(
                            (accu: JSX.Element[] | null, elem: JSX.Element) => {
                                return accu === null
                                    ? [elem]
                                    : [...accu, <>{', '}</>, elem];
                            },
                            null,
                        )}
                </TextComponent>
            )}
        </div>
    );
}
