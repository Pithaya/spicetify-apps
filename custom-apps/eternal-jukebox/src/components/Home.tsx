import { useObservableEagerState } from 'observable-hooks';
import React, { useEffect, useState } from 'react';
import { type GraphState } from '../models/graph/graph-state';
import { SettingsButton } from './settings/SettingsButton';
import { StatsCard } from './StatsCard';
import { JukeboxVisualizer } from './visualizer/JukeboxVisualizer';

export function Home(): JSX.Element {
    const isEnabled = useObservableEagerState(window.jukebox.isEnabled$);
    const songState = useObservableEagerState(window.jukebox.songState$);

    const [graphState, setGraphState] = useState<GraphState>({
        beats: [],
        remixedBeats: [],
        segments: [],
    });

    useEffect(() => {
        const subscription = window.jukebox.songState$.subscribe(
            (songState) => {
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

    return (
        <div className="@container h-full w-full">
            <div className="absolute top-[64px] right-4">
                <SettingsButton />
            </div>

            {!isEnabled && (
                <div className="flex h-full w-full flex-col items-center justify-center">
                    <h1>Jukebox not enabled.</h1>
                </div>
            )}

            {isEnabled && songState === null && (
                <div className="flex h-full w-full flex-col items-center justify-center">
                    <h1>Loading...</h1>
                </div>
            )}

            {isEnabled && songState !== null && (
                <div className="@8xl:flex-row flex h-full w-full flex-col">
                    <div className="min-h-0 grow">
                        <JukeboxVisualizer state={graphState} />
                    </div>
                    <div className="mx-4 mb-4 shrink-0 self-end">
                        <StatsCard />
                    </div>
                </div>
            )}
        </div>
    );
}
