import { ALBUM_ROUTE } from 'custom-apps/better-local-files/src/constants/constants';
import { navigateTo } from 'custom-apps/better-local-files/src/helpers/history-helper';
import type { Track } from 'custom-apps/better-local-files/src/models/track';
import React from 'react';
import { TextComponent } from '../text/text';

type Props = {
    track: Track;
};

export function TrackListRowAlbumLink(props: Readonly<Props>): JSX.Element {
    return (
        <TextComponent variant="mesto">
            <a
                className="standalone-ellipsis-one-line"
                dir="auto"
                href="#"
                tabIndex={-1}
                onClick={() => {
                    navigateTo(ALBUM_ROUTE, props.track.album.uri);
                }}
            >
                {props.track.album.name}
            </a>
        </TextComponent>
    );
}
