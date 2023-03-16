import styles from '../css/app.module.scss';
import React, { useEffect, useState } from 'react';
import { JukeboxVisualizer } from './jukebox-visualizer.component';
import { millisToMinutesAndSeconds } from '../utils/time-utils';
import { initSvgDrawData } from '../helpers/visualization-builder';
import { IGraphState } from '../models/graph/graph-state';

// TODO: Add settings button and modal

interface ITrackState {
    trackName: string;
    artistName: string;
}

interface IStatsState {
    beatsPlayed: number;
    currentRandomBranchChance: number;
    listenTime: string;
}

export function HomeComponent() {
    const [trackState, setTrackState] = useState<ITrackState>({
        trackName: '',
        artistName: '',
    });

    const [graphState, setGraphState] = useState<IGraphState>({
        beats: [],
        remixedBeats: [],
        segments: [],
    });

    const [statsState, setStatsState] = useState<IStatsState>({
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

                console.log('graph state change');
                setGraphState({
                    beats: songState?.graph.beats ?? [],
                    segments: songState?.analysis.segments ?? [],
                    remixedBeats: songState?.analysis.beats ?? [],
                });
            }
        );

        return subscription.unsubscribe;
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

        return subscription.unsubscribe;
    }, []);

    // TODO: Refactor this with jukebox visualizer
    const svgSize = 600;
    const halfSize = svgSize / 2;

    const drawData = initSvgDrawData(svgSize, halfSize, graphState);

    return (
        <div className={styles.container}>
            <h1>{trackState.trackName}</h1>
            <p>by</p>
            <h2>{trackState.artistName}</h2>

            <JukeboxVisualizer drawData={drawData}></JukeboxVisualizer>

            <div className={styles.stats}>
                <span>{`Total Beats: ${statsState.beatsPlayed}`}</span>
                <span>
                    {`Current branch change: ${Math.round(
                        statsState.currentRandomBranchChance
                    )}%`}
                </span>
                <span>{`Listen Time: ${statsState.listenTime}`}</span>
            </div>
        </div>
    );
}
