import React from 'react';
import type { ITrack } from './models/interfaces';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';

type Props = {
    track: ITrack;
    onAlbumClick: (albumUri: string) => void;
};

/**
 * Section of a track list row that shows the track's album.
 */
export function TrackListRowAlbumLink(props: Readonly<Props>): JSX.Element {
    return (
        <TextComponent variant="mesto">
            <a
                className="standalone-ellipsis-one-line"
                dir="auto"
                href="#"
                tabIndex={-1}
                onClick={() => {
                    props.onAlbumClick(props.track.album.uri);
                }}
            >
                {props.track.album.name}
            </a>
        </TextComponent>
    );
}
