import React, { useState } from 'react';
import type { EdgeDrawData } from '../../models/visualization/edge-draw-data';

type Props = {
    drawData: EdgeDrawData;
};

export function VisualizerEdge(props: Readonly<Props>): JSX.Element {
    const [isHovered, setIsHovered] = useState(false);

    function onMouseOver(node: Node): void {
        // Move the hovered edge to the front of the SVG
        const svg = document.getElementById('jukebox-graph');
        svg?.firstChild?.appendChild(node);

        setIsHovered(true);
    }

    function onMouseOut(): void {
        setIsHovered(false);
    }

    return (
        <path
            className={Spicetify.classnames(
                '[stroke-opacity:0.7]',
                'hover:[stroke-opacity:1]',
            )}
            fill="none"
            stroke={
                props.drawData.edge.isPlaying || isHovered
                    ? props.drawData.activeColor
                    : props.drawData.color
            }
            strokeWidth={props.drawData.strokeWidth}
            d={props.drawData.drawCommand}
            onMouseOver={(event) => {
                onMouseOver(event.target as Node);
            }}
            onMouseOut={onMouseOut}
        >
            <title>
                {`${props.drawData.edge.source.index.toFixed()} - ${props.drawData.edge.destination.index.toFixed()}`}
            </title>
        </path>
    );
}
