import React from 'react';
import type { ITrack } from './models/interfaces';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';

type Props = {
    track: ITrack;
    withArtists: boolean;
    onArtistClick: (artistUri: string) => void;
};

/**
 * Title section of a track list row.
 * Shows the track name and artists.
 */
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
                                    props.onArtistClick(a.uri);
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
