import type { Segment } from '@shared/api/models/audio-analysis';
import tinycolor from 'tinycolor2';
import type { Beat } from '../models/graph/beat';
import type { GraphState } from '../models/graph/graph-state';
import type { BeatDrawData } from '../models/visualization/beat-draw-data';
import type { EdgeDrawData } from '../models/visualization/edge-draw-data';
import type { GraphDrawData } from '../models/visualization/graph-draw-data';
import { Point } from '../models/visualization/point';
import { getPointFromPercent } from '../utils/math-utils';

/**
 * SVG size.
 * SVG size = (inner circle radius + maximum tile height) * 2.
 */
const svgSize = 100;
const halfSize = svgSize / 2;

const viewBox = `0 0 ${svgSize.toFixed()} ${svgSize.toFixed()}`;

const centerTransform = `scale(-1,1) translate(${(-svgSize).toFixed()}, 0) rotate(-90,${halfSize.toFixed()},${halfSize.toFixed()})`;

/**
 * Inner circle radius.
 */
const innerCircleRadius = 40;

/**
 * Minimum height for a tile.
 */
const minTileHeight = 2;

/**
 * How much a tile should grow per beat.
 */
const tileHeightIncrementPerBeat = 0.2;

/**
 * How much a tile should grow when it's playing.
 */
const isPlayingAdditionalTileHeight = 1;

/**
 * Maximum height for a tile (8).
 */
const maxTileHeight =
    halfSize - (innerCircleRadius + isPlayingAdditionalTileHeight);

export function initSvgDrawData(graphState: GraphState): GraphDrawData {
    if (graphState.beats.length === 0) {
        return { beats: [], edges: [], viewBox, centerTransform };
    }

    const [cmin, cmax] = normalizeColor(graphState);

    // Prevent an empty first slice if the first beat doesn't start at 0
    const offset = graphState.beats[0].start;

    // Use the run time from the last beat
    const totalDuration =
        graphState.beats[graphState.beats.length - 1].start +
        graphState.beats[graphState.beats.length - 1].duration -
        offset;

    const beatsDrawData = getBeatsDrawData(
        graphState,
        offset,
        totalDuration,
        cmin,
        cmax,
    );
    const edgesDrawData = getEdgesDrawData(beatsDrawData, halfSize);

    return {
        beats: beatsDrawData,
        edges: edgesDrawData,
        viewBox,
        centerTransform,
    };
}

function getBeatsDrawData(
    graphState: GraphState,
    offset: number,
    totalDuration: number,
    cmin: number[],
    cmax: number[],
): BeatDrawData[] {
    return graphState.beats.map((beat) => {
        const percentFromStart = ((beat.start - offset) * 100) / totalDuration;
        const percentOfSong = (beat.duration * 100) / totalDuration;

        const currentTileHeight = Math.min(
            minTileHeight +
                tileHeightIncrementPerBeat * beat.playCount +
                (beat.isPlaying ? isPlayingAdditionalTileHeight : 0),
            maxTileHeight,
        );

        const outerCircleRadius = innerCircleRadius + currentTileHeight;

        // Outer arc
        const outerArcStart = getPointFromPercent(
            percentFromStart,
            outerCircleRadius,
            svgSize,
        );
        const outerArcEnd = getPointFromPercent(
            percentFromStart + percentOfSong,
            outerCircleRadius,
            svgSize,
        );

        // Inner arc
        const innerArcStart = getPointFromPercent(
            percentFromStart,
            innerCircleRadius,
            svgSize,
        );
        const innerArcEnd = getPointFromPercent(
            percentFromStart + percentOfSong,
            innerCircleRadius,
            svgSize,
        );

        const color = getBeatColor(graphState, beat, cmin, cmax);

        const drawCommand = `M ${outerArcStart.toString()} 
        A ${outerCircleRadius.toString()},${outerCircleRadius.toString()} 0 0 0 ${outerArcEnd.toString()}
        L ${innerArcEnd.toString()}
        A ${innerCircleRadius.toString()},${innerCircleRadius.toString()} 0 0 1 ${innerArcStart.toString()}`;

        const drawData: BeatDrawData = {
            beat,
            percentFromStart,
            percentOfSong,
            outerArcStart,
            outerArcEnd,
            innerArcStart,
            innerArcEnd,
            drawCommand,
            color,
            activeColor: tinycolor(color)
                .complement()
                .saturate(100)
                .toHexString(),
        };

        return drawData;
    });
}

function getEdgesDrawData(
    beatDrawData: BeatDrawData[],
    halfSize: number,
): EdgeDrawData[] {
    const result = [];

    for (const drawData of beatDrawData) {
        for (const neighbour of drawData.beat.neighbours) {
            const startData = beatDrawData[neighbour.source.index];
            const endData = beatDrawData[neighbour.destination.index];

            const edgeStart = Point.getMiddlePoint(
                startData.innerArcStart,
                startData.innerArcEnd,
            );
            const edgeEnd = Point.getMiddlePoint(
                endData.innerArcStart,
                endData.innerArcEnd,
            );

            const startWidth = Point.getDistanceBetweenPoints(
                startData.innerArcStart,
                startData.innerArcEnd,
            );

            const endWidth = Point.getDistanceBetweenPoints(
                endData.innerArcStart,
                endData.innerArcEnd,
            );

            const edgeDrawData: EdgeDrawData = {
                edge: neighbour,
                strokeWidth: Math.min(startWidth, endWidth),
                drawCommand: `
                        M ${edgeStart.toString()}
                        Q ${halfSize.toFixed()},${halfSize.toFixed()} ${edgeEnd.toString()}`,
                color: drawData.color,
                activeColor: drawData.activeColor,
            };

            result.push(edgeDrawData);
        }
    }

    return result;
}

function normalizeColor(graphState: GraphState): number[][] {
    const cmin = [100, 100, 100];
    const cmax = [-100, -100, -100];

    for (const segment of graphState.segments) {
        for (let j = 0; j < 3; j++) {
            const timbre = segment.timbre[j + 1];

            if (timbre < cmin[j]) {
                cmin[j] = timbre;
            }

            if (timbre > cmax[j]) {
                cmax[j] = timbre;
            }
        }
    }

    return [cmin, cmax];
}

/**
 * Get a color for this beat, in hex format.
 * @param beat The beat.
 * @returns The color.
 */
function getBeatColor(
    graphState: GraphState,
    beat: Beat,
    cmin: number[],
    cmax: number[],
): string {
    const segment =
        graphState.remixedBeats[beat.index].firstOverlappingSegment ?? null;

    if (segment !== null) {
        return getSegmentColor(segment, cmin, cmax);
    } else {
        return '#000';
    }
}

/**
 * Use the segment's timbre to get a color in hex format.
 * @param segment The segment.
 * @returns The color.
 */
function getSegmentColor(
    segment: Segment,
    cmin: number[],
    cmax: number[],
): string {
    const results = [];

    for (let i = 0; i < 3; i++) {
        const timbre = segment.timbre[i + 1];
        const norm = (timbre - cmin[i]) / (cmax[i] - cmin[i]);

        results[i] = norm;
    }

    const rgb = tinycolor.fromRatio({
        r: results[1],
        g: results[2],
        b: results[0],
    });
    return rgb.toHexString();
}
