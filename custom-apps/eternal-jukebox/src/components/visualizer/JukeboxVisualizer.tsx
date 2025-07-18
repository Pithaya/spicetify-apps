import React from 'react';
import { initSvgDrawData } from '../../helpers/visualization-builder';
import type { GraphState } from '../../models/graph/graph-state';
import { VisualizerEdge } from './VisualizerEdge';
import { VisualizerSlice } from './VisualizerSlice';

type Props = {
    state: GraphState;
};

// Reference: https://dev.to/mustapha/how-to-create-an-interactive-svg-donut-chart-using-angular-19eo

export function JukeboxVisualizer(props: Readonly<Props>): JSX.Element {
    if (props.state.beats.length === 0) {
        return <div>Loading...</div>;
    }

    const drawData = initSvgDrawData(props.state);

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
                    />
                ))}
                {drawData.edges.map((currentData) => (
                    <VisualizerEdge
                        key={`${currentData.edge.source.index.toFixed()}-${currentData.edge.destination.index.toFixed()}`}
                        drawData={currentData}
                    />
                ))}
            </g>
        </svg>
    );
}
