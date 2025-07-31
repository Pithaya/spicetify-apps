import React, { useEffect, useRef, useState } from 'react';
import type { EdgeDrawData } from '../../models/visualization/edge-draw-data';

type Props = {
    drawData: EdgeDrawData;
    isPlaying: boolean;
};

export function VisualizerEdge(props: Readonly<Props>): JSX.Element {
    const [isHovered, setIsHovered] = useState(false);
    const pathRef = useRef<SVGPathElement | null>(null);

    function moveToFront(): void {
        // Move the hovered edge to the front of the SVG
        if (pathRef.current === null) {
            return;
        }

        const svg = document.getElementById('jukebox-graph');
        svg?.firstChild?.appendChild(pathRef.current);
    }

    function onMouseOver(): void {
        moveToFront();
        setIsHovered(true);
    }

    function onMouseOut(): void {
        setIsHovered(false);
    }

    useEffect(() => {
        if (props.isPlaying) {
            moveToFront();
        }
    }, [props.isPlaying]);

    return (
        <path
            className={Spicetify.classnames(
                '[stroke-opacity:0.7]',
                'hover:[stroke-opacity:1]',
            )}
            fill="none"
            stroke={
                props.isPlaying || isHovered
                    ? props.drawData.activeColor
                    : props.drawData.color
            }
            strokeWidth={props.drawData.strokeWidth}
            d={props.drawData.drawCommand}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            ref={pathRef}
        >
            <title>
                {`${props.drawData.edge.source.index.toFixed()} - ${props.drawData.edge.destination.index.toFixed()}`}
            </title>
        </path>
    );
}
