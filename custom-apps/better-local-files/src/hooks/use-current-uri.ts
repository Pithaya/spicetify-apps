import { useEffect, useState } from 'react';

export function useCurrentPlayerTrackUri() {
    const [playingTrackUri, setPlayingTrackUri] = useState(
        Spicetify.Player.data.track?.uri ?? ''
    );

    useEffect(() => {
        function handleSongChange(event?: Event) {
            setPlayingTrackUri(
                ((event as any)?.data as Spicetify.PlayerState).track?.uri ?? ''
            );
        }

        Spicetify.Player.addEventListener('songchange', handleSongChange);

        return () =>
            Spicetify.Player.removeEventListener(
                'songchange',
                handleSongChange
            );
    });

    return playingTrackUri;
}
