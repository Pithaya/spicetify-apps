import React, { useEffect, useState } from 'react';
import { type GraphState } from '../models/graph/graph-state';
import { millisToMinutesAndSeconds } from '../utils/time-utils';
import styles from './Home.module.scss';
import { SettingsButton } from './settings/SettingsButton';
import { JukeboxVisualizer } from './visualizer/JukeboxVisualizer';

type TrackState = {
    trackName: string;
    artistName: string;
};

type StatsState = {
    beatsPlayed: number;
    currentRandomBranchChance: number;
    listenTime: string;
};

export function Home(): JSX.Element {
    const [trackState, setTrackState] = useState<TrackState>({
        trackName: '',
        artistName: '',
    });

    const [graphState, setGraphState] = useState<GraphState>({
        beats: [],
        remixedBeats: [],
        segments: [],
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

                setGraphState({
                    beats: songState?.graph.beats ?? [],
                    segments: songState?.analysis.segments ?? [],
                    remixedBeats: songState?.analysis.beats ?? [],
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
        <div className={styles.container}>
            <div
                className={Spicetify.classnames(
                    styles['area-title'],
                    'flex flex-col items-center justify-start',
                )}
            >
                <h1>{trackState.trackName}</h1>
                <p>by</p>
                <h2>{trackState.artistName}</h2>
            </div>

            <div
                className={Spicetify.classnames(
                    styles['area-button'],
                    'flex items-start justify-end pe-8',
                )}
            >
                <SettingsButton />
            </div>

            <div className={Spicetify.classnames(styles['area-content'])}>
                <JukeboxVisualizer state={graphState}></JukeboxVisualizer>
            </div>

            <div
                className={Spicetify.classnames(
                    styles['area-stats'],
                    'flex justify-around py-4',
                )}
            >
                <span>Total Beats: {statsState.beatsPlayed.toFixed()}</span>
                <span>
                    Current branch change:{' '}
                    {statsState.currentRandomBranchChance.toFixed(2)}%
                </span>
                <span>Listen Time: {statsState.listenTime}</span>
            </div>
        </div>
    );
}
