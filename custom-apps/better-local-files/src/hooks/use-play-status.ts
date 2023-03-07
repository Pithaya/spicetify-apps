import { useEffect, useState } from 'react';

export type PlayStatus = 'play' | 'pause';

export function usePlayStatus() {
    const [playStatus, setPlayStatus] = useState<PlayStatus>(
        Spicetify.Player?.data?.is_paused ? 'pause' : 'play'
    );

    useEffect(() => {
        function handleStatusChange(event?: Event) {
            setPlayStatus(
                ((event as any)?.data as Spicetify.PlayerState).is_paused
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
