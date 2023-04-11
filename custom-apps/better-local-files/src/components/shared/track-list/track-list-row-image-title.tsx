import { Track } from 'custom-apps/better-local-files/src/models/track';
import React from 'react';
import { TrackListRowTitle } from './track-list-row-title';

// TODO: Only relevant props
interface TrackListRowImageTitleProps {
    track: Track;
    withArtists: boolean;
}

export function TrackListRowImageTitle(props: TrackListRowImageTitleProps) {
    const imageFallback = `
    <div class="main-trackList-rowImage main-trackList-rowImageFallback">
        <svg
            role="img"
            height="16"
            width="16"
            aria-hidden="true"
            viewBox="0 0 16 16"
            fill="currentColor"
        >
            <path d="M10 2v9.5a2.75 2.75 0 11-2.75-2.75H8.5V2H10zm-1.5 8.25H7.25A1.25 1.25 0 108.5 11.5v-1.25z"></path>
        </svg>
    </div>`;

    return (
        <>
            <img
                aria-hidden="false"
                draggable="false"
                loading="eager"
                src={props.track.localTrack.album.images[0].url}
                alt="Track image" // TODO: i18n
                className="main-image-image main-trackList-rowImage main-image-loaded"
                width="40"
                height="40"
                onError={(e) => (e.currentTarget.outerHTML = imageFallback)}
            />

            <TrackListRowTitle
                track={props.track}
                withArtists={props.withArtists}
            />
        </>
    );
}
