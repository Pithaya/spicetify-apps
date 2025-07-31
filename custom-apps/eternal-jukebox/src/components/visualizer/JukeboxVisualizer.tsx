import React from 'react';
import { initSvgDrawData } from '../../helpers/visualization-builder';
import { type DriverState } from '../../models/driver-state';
import { type JukeboxSongState } from '../../models/jukebox-song-state';
import { VisualizerEdge } from './VisualizerEdge';
import { VisualizerSlice } from './VisualizerSlice';

type Props = {
    songState: JukeboxSongState;
    driverState: DriverState;
};

// Reference: https://dev.to/mustapha/how-to-create-an-interactive-svg-donut-chart-using-angular-19eo

export function JukeboxVisualizer(props: Readonly<Props>): JSX.Element {
    console.time('initSvgDrawData');

    const drawData = initSvgDrawData(props.songState, props.driverState);

    console.timeEnd('initSvgDrawData');

    return (
        <svg
            id="jukebox-graph"
            viewBox={drawData.viewBox}
            className="h-full w-full"
        >
            <g transform={drawData.centerTransform}>
                {drawData.beats.map((currentData) => (
                    <VisualizerSlice
                        key={currentData.beat.index}
                        drawData={currentData}
                        isPlaying={props.driverState.playingBeats.has(
                            currentData.beat.index,
                        )}
                    />
                ))}
                {drawData.edges.map((currentData) => (
                    <VisualizerEdge
                        key={currentData.edge.id}
                        drawData={currentData}
                        isPlaying={
                            props.driverState.playingBranch ===
                            currentData.edge.id
                        }
                    />
                ))}
            </g>
        </svg>
    );
}
