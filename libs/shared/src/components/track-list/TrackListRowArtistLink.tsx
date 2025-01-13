import React from 'react';
import type { ITrack } from './models/interfaces';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';

type Props = {
    track: ITrack;
    onArtistClick: (artistUri: string) => void;
};

/**
 * Section of a track list row that shows the track's artists.
 */
export function TrackListRowArtistLink(props: Readonly<Props>): JSX.Element {
    return (
        <TextComponent className="standalone-ellipsis-one-line" variant="mesto">
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
                .reduce((accu: JSX.Element[] | null, elem: JSX.Element) => {
                    return accu === null
                        ? [elem]
                        : [...accu, <>{', '}</>, elem];
                }, null)}
        </TextComponent>
    );
}
