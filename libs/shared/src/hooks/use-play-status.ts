import { useEffect, useState } from 'react';

export enum PlayStatus {
    Playing = 'playing',
    Paused = 'paused',
    Stopped = 'stopped',
    Buffering = 'buffering',
}

const toPlayStatus = (state: Spicetify.PlayerState | undefined): PlayStatus => {
    if (state === undefined) {
        return PlayStatus.Stopped;
    }

    if (state.isPaused) {
        return PlayStatus.Paused;
    }

    if (state.isBuffering) {
        return PlayStatus.Buffering;
    }

    return PlayStatus.Playing;
};

export function usePlayStatus(): PlayStatus {
    const [playStatus, setPlayStatus] = useState<PlayStatus>(
        toPlayStatus(Spicetify.Player.data),
    );

    useEffect(() => {
        function handleStatusChange(
            event?: Event & {
                data: Spicetify.PlayerState;
            },
        ): void {
            const playerState = event?.data;
            const playStatus = toPlayStatus(playerState);

            setPlayStatus(playStatus);
        }

        Spicetify.Player.addEventListener('onplaypause', handleStatusChange);

        return () => {
            Spicetify.Player.removeEventListener(
                'onplaypause',
                handleStatusChange,
            );
        };
    });

    return playStatus;
}
