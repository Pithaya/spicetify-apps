import { ARTIST_ROUTE } from 'custom-apps/better-local-files/src/constants/constants';
import { navigateTo } from 'custom-apps/better-local-files/src/utils/history.utils';
import type { Track } from 'custom-apps/better-local-files/src/models/track';
import React from 'react';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';

type Props = {
    track: Track;
};

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
                            navigateTo(ARTIST_ROUTE, a.uri);
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
