import { useEffect, useState } from 'react';

export function useCurrentPlayerTrackUri(): string | undefined {
    const [playingTrackUri, setPlayingTrackUri] = useState(
        Spicetify.Player.data?.item.uri,
    );

    useEffect(() => {
        function handleSongChange(
            event?: Event & {
                data: Spicetify.PlayerState;
            },
        ): void {
            setPlayingTrackUri(event?.data.item.uri ?? '');
        }

        Spicetify.Player.addEventListener('songchange', handleSongChange);

        return () => {
            Spicetify.Player.removeEventListener(
                'songchange',
                handleSongChange,
            );
        };
    });

    return playingTrackUri;
}
