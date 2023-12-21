import { useEffect, useState } from 'react';

export type PlayStatus = 'play' | 'pause';

export function usePlayStatus() {
    const [playStatus, setPlayStatus] = useState<PlayStatus>(
        Spicetify.Player?.data?.isPaused ? 'pause' : 'play'
    );

    useEffect(() => {
        function handleStatusChange(event?: Event) {
            setPlayStatus(
                ((event as any)?.data as Spicetify.PlayerState).isPaused
                    ? 'pause'
                    : 'play'
            );
        }

        Spicetify.Player.addEventListener('onplaypause', handleStatusChange);

        return () =>
            Spicetify.Player.removeEventListener(
                'onplaypause',
                handleStatusChange
            );
    });

    return playStatus;
}
