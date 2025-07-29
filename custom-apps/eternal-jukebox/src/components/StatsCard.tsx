import React, { useEffect, useState } from 'react';
import { millisToMinutesAndSeconds } from '../utils/time-utils';

type TrackState = {
    trackName: string;
    artistName: string;
};

type StatsState = {
    beatsPlayed: number;
    currentRandomBranchChance: number;
    listenTime: string;
};

export function StatsCard(): JSX.Element {
    const [trackState, setTrackState] = useState<TrackState>({
        trackName: '',
        artistName: '',
    });

    const [statsState, setStatsState] = useState<StatsState>({
        beatsPlayed: 0,
        listenTime: '0',
        currentRandomBranchChance: 0,
    });

    useEffect(() => {
        const subscription = window.jukebox.songState$.subscribe(
            (songState) => {
                setTrackState({
                    trackName: songState?.track?.metadata?.title ?? '',
                    artistName: songState?.track?.metadata?.artist_name ?? '',
                });
            },
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        const subscription = window.jukebox.statsChanged$.subscribe((stats) => {
            setStatsState({
                beatsPlayed: stats.beatsPlayed,
                currentRandomBranchChance:
                    stats.currentRandomBranchChance * 100,
                listenTime: millisToMinutesAndSeconds(stats.listenTime),
            });
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <div className="flex min-w-96 flex-col gap-1 rounded-lg bg-(--spice-sidebar) p-4">
            <h1 className="text-lg font-bold">{trackState.trackName}</h1>

            <span>Total beats: {statsState.beatsPlayed.toFixed()}</span>
            <span>
                Current branch change:{' '}
                {statsState.currentRandomBranchChance.toFixed(2)}%
            </span>
            <span>Listen time: {statsState.listenTime}</span>
        </div>
    );
}
