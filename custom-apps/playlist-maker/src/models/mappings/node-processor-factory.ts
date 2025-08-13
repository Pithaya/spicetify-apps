import type { Edge, Node } from 'reactflow';
import type { CustomNodeType, ResultNodeType } from '../../types/node-types';
import { getIncomingNodeIdsForHandle } from '../../utils/node-utils';
import type { BaseNodeData } from '../processors/base-node-processor';
import {
    type AcousticnessData,
    AcousticnessProcessor,
} from '../processors/filter/acousticness-processor';
import {
    type DanceabilityData,
    DanceabilityProcessor,
} from '../processors/filter/danceability-processor';
import {
    type DurationData,
    DurationProcessor,
} from '../processors/filter/duration-processor';
import {
    type EnergyData,
    EnergyProcessor,
} from '../processors/filter/energy-processor';
import {
    type InstrumentalnessData,
    InstrumentalnessProcessor,
} from '../processors/filter/instrumentalness-processor';
import {
    type IsPlayableData,
    IsPlayableProcessor,
} from '../processors/filter/is-playable-processor';
import {
    type LivenessData,
    LivenessProcessor,
} from '../processors/filter/liveness-processor';
import {
    type LoudnessData,
    LoudnessProcessor,
} from '../processors/filter/loudness-processor';
import {
    type ModeData,
    ModeProcessor,
} from '../processors/filter/mode-processor';
import {
    type ReleaseDateData,
    ReleaseDateProcessor,
} from '../processors/filter/release-date-processor';
import {
    type SpeechinessData,
    SpeechinessProcessor,
} from '../processors/filter/speechiness-processor';
import {
    type TempoData,
    TempoProcessor,
} from '../processors/filter/tempo-processor';
import {
    type ValenceData,
    ValenceProcessor,
} from '../processors/filter/valence-processor';
import type { NodeProcessor } from '../processors/node-processor';
import { DeduplicateProcessor } from '../processors/processing/deduplicate-processor';
import { DifferenceProcessor } from '../processors/processing/difference-processor';
import { IntersectionProcessor } from '../processors/processing/intersection-processor';
import { RelativeComplementProcessor } from '../processors/processing/relative-complement-processor';
import { ShuffleProcessor } from '../processors/processing/shuffle-processor';
import {
    type OrderByData,
    SortProcessor,
} from '../processors/processing/sort-processor';
import {
    type AlbumData,
    AlbumSourceProcessor,
} from '../processors/sources/album-source-processor';
import {
    type ArtistData,
    ArtistTracksSourceProcessor,
} from '../processors/sources/artist-tracks-source-processor';
import {
    type LikedSongsData,
    LikedSongsSourceProcessor,
} from '../processors/sources/liked-songs-source-processor';
import {
    type LocalTracksData,
    LocalTracksSourceProcessor,
} from '../processors/sources/local-tracks-source-processor';
import {
    type PlaylistData,
    PlaylistSourceProcessor,
} from '../processors/sources/playlist-tracks-source-processor';
import {
    type RadioData,
    RadioSourceProcessor,
} from '../processors/sources/radio-source-processor';
import {
    type TopTracksData,
    TopTracksSourceProcessor,
} from '../processors/sources/top-tracks-source-processor';
import {
    type SubsetData,
    SubsetProcessor,
} from '../processors/processing/subset-processor';

/**
 * Constructs a processor for the specified node type.
 */
export const nodeProcessorFactory: Record<
    Exclude<CustomNodeType, ResultNodeType>,
    (node: Node, incomers: Node[], edges: Edge[]) => NodeProcessor<BaseNodeData>
> = {
    likedSongsSource: (node: Node<LikedSongsData>, _incomers) =>
        new LikedSongsSourceProcessor(node.id, { source: [] }, node.data),
    localTracksSource: (node: Node<LocalTracksData>, _incomers) =>
        new LocalTracksSourceProcessor(node.id, { source: [] }, node.data),
    libraryPlaylistSource: (node: Node<PlaylistData>, _incomers) =>
        new PlaylistSourceProcessor(node.id, { source: [] }, node.data),
    searchPlaylistSource: (node: Node<PlaylistData>, _incomers) =>
        new PlaylistSourceProcessor(node.id, { source: [] }, node.data),
    topTracksSource: (node: Node<TopTracksData>, _incomers) =>
        new TopTracksSourceProcessor(node.id, { source: [] }, node.data),
    libraryAlbumSource: (node: Node<AlbumData>, _incomers) =>
        new AlbumSourceProcessor(node.id, { source: [] }, node.data),
    searchAlbumSource: (node: Node<AlbumData>, _incomers) =>
        new AlbumSourceProcessor(node.id, { source: [] }, node.data),
    libraryArtistSource: (node: Node<ArtistData>, _incomers) =>
        new ArtistTracksSourceProcessor(node.id, { source: [] }, node.data),
    searchArtistSource: (node: Node<ArtistData>, _incomers) =>
        new ArtistTracksSourceProcessor(node.id, { source: [] }, node.data),
    deduplicate: (node: Node<BaseNodeData>, incomers) =>
        new DeduplicateProcessor(
            node.id,
            { source: incomers.map((node) => node.id) },
            node.data,
        ),
    isPlayable: (node: Node<IsPlayableData>, incomers) =>
        new IsPlayableProcessor(
            node.id,
            { source: incomers.map((node) => node.id) },
            node.data,
        ),
    acousticness: (node: Node<AcousticnessData>, incomers) =>
        new AcousticnessProcessor(
            node.id,
            { source: incomers.map((node) => node.id) },
            node.data,
        ),
    shuffle: (node: Node<BaseNodeData>, incomers) =>
        new ShuffleProcessor(
            node.id,
            { source: incomers.map((node) => node.id) },
            node.data,
        ),
    sort: (node: Node<OrderByData>, incomers) =>
        new SortProcessor(
            node.id,
            { source: incomers.map((node) => node.id) },
            node.data,
        ),
    danceability: (node: Node<DanceabilityData>, incomers) =>
        new DanceabilityProcessor(
            node.id,
            { source: incomers.map((node) => node.id) },
            node.data,
        ),
    energy: (node: Node<EnergyData>, incomers) =>
        new EnergyProcessor(
            node.id,
            { source: incomers.map((node) => node.id) },
            node.data,
        ),
    instrumentalness: (node: Node<InstrumentalnessData>, incomers) =>
        new InstrumentalnessProcessor(
            node.id,
            { source: incomers.map((node) => node.id) },
            node.data,
        ),
    liveness: (node: Node<LivenessData>, incomers) =>
        new LivenessProcessor(
            node.id,
            { source: incomers.map((node) => node.id) },
            node.data,
        ),
    loudness: (node: Node<LoudnessData>, incomers) =>
        new LoudnessProcessor(
            node.id,
            { source: incomers.map((node) => node.id) },
            node.data,
        ),
    speechiness: (node: Node<SpeechinessData>, incomers) =>
        new SpeechinessProcessor(
            node.id,
            { source: incomers.map((node) => node.id) },
            node.data,
        ),
    valence: (node: Node<ValenceData>, incomers) =>
        new ValenceProcessor(
            node.id,
            { source: incomers.map((node) => node.id) },
            node.data,
        ),
    tempo: (node: Node<TempoData>, incomers) =>
        new TempoProcessor(
            node.id,
            { source: incomers.map((node) => node.id) },
            node.data,
        ),
    mode: (node: Node<ModeData>, incomers) =>
        new ModeProcessor(
            node.id,
            { source: incomers.map((node) => node.id) },
            node.data,
        ),
    radioAlbumSource: (node: Node<RadioData>, _incomers) =>
        new RadioSourceProcessor(node.id, { source: [] }, node.data),
    radioArtistSource: (node: Node<RadioData>, _incomers) =>
        new RadioSourceProcessor(node.id, { source: [] }, node.data),
    radioTrackSource: (node: Node<RadioData>, _incomers) =>
        new RadioSourceProcessor(node.id, { source: [] }, node.data),
    releaseDate: (node: Node<ReleaseDateData>, incomers) =>
        new ReleaseDateProcessor(
            node.id,
            { source: incomers.map((node) => node.id) },
            node.data,
        ),
    duration: (node: Node<DurationData>, incomers) =>
        new DurationProcessor(
            node.id,
            { source: incomers.map((node) => node.id) },
            node.data,
        ),
    intersection: (node: Node<BaseNodeData>, incomers, edges) => {
        return new IntersectionProcessor(
            node.id,
            {
                'first-set': getIncomingNodeIdsForHandle(
                    node,
                    'first-set',
                    incomers,
                    edges,
                ),
                'second-set': getIncomingNodeIdsForHandle(
                    node,
                    'second-set',
                    incomers,
                    edges,
                ),
            },
            node.data,
        );
    },
    difference: (node: Node<BaseNodeData>, incomers, edges) =>
        new DifferenceProcessor(
            node.id,
            {
                'first-set': getIncomingNodeIdsForHandle(
                    node,
                    'first-set',
                    incomers,
                    edges,
                ),
                'second-set': getIncomingNodeIdsForHandle(
                    node,
                    'second-set',
                    incomers,
                    edges,
                ),
            },
            node.data,
        ),
    relativeComplement: (node: Node<BaseNodeData>, incomers, edges) =>
        new RelativeComplementProcessor(
            node.id,
            {
                'first-set': getIncomingNodeIdsForHandle(
                    node,
                    'first-set',
                    incomers,
                    edges,
                ),
                'second-set': getIncomingNodeIdsForHandle(
                    node,
                    'second-set',
                    incomers,
                    edges,
                ),
            },
            node.data,
        ),
    subset: (node: Node<SubsetData>, incomers) =>
        new SubsetProcessor(
            node.id,
            { source: incomers.map((node) => node.id) },
            node.data,
        ),
};
