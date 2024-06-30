import { useEffect, useState } from 'react';

export function useCurrentPlayerTrackUri(): string {
    const [playingTrackUri, setPlayingTrackUri] = useState(
        Spicetify.Player?.data?.item?.uri ?? '',
    );

    useEffect(() => {
        function handleSongChange(event?: Event): void {
            setPlayingTrackUri(
                ((event as any)?.data as Spicetify.PlayerState).item?.uri ?? '',
            );
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
