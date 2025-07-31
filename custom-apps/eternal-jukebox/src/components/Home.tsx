import { useObservableEagerState } from 'observable-hooks';
import React from 'react';
import { SettingsButton } from './settings/SettingsButton';
import { StatsCard } from './StatsCard';
import { JukeboxVisualizer } from './visualizer/JukeboxVisualizer';

export function Home(): JSX.Element {
    const isEnabled = useObservableEagerState(window.jukebox.isEnabled$);
    const songState = useObservableEagerState(window.jukebox.songState$);
    const driverState = useObservableEagerState(window.jukebox.driverState$);

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
                        <JukeboxVisualizer
                            songState={songState}
                            driverState={driverState}
                        />
                    </div>
                    <div className="mx-4 mb-4 shrink-0 self-end">
                        <StatsCard
                            trackName={songState.track.metadata?.title ?? '-'}
                            driverState={driverState}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
