import type { Edge, Node } from 'reactflow';
import {
    AcousticnessProcessor,
    MAX_ACOUSTICNESS,
    MIN_ACOUSTICNESS,
    type AcousticnessData,
} from '../models/nodes/filter/acousticness-processor';
import {
    DanceabilityProcessor,
    MAX_DANCEABILITY,
    MIN_DANCEABILITY,
    type DanceabilityData,
} from '../models/nodes/filter/danceability-processor';
import {
    DurationProcessor,
    type DurationData,
} from '../models/nodes/filter/duration-processor';
import {
    EnergyProcessor,
    MAX_ENERGY,
    MIN_ENERGY,
    type EnergyData,
} from '../models/nodes/filter/energy-processor';
import {
    InstrumentalnessProcessor,
    MAX_INSTRUMENTALNESS,
    MIN_INSTRUMENTALNESS,
    type InstrumentalnessData,
} from '../models/nodes/filter/instrumentalness-processor';
import {
    IsPlayableProcessor,
    type IsPlayableData,
} from '../models/nodes/filter/is-playable-processor';
import {
    LivenessProcessor,
    MAX_LIVENESS,
    MIN_LIVENESS,
    type LivenessData,
} from '../models/nodes/filter/liveness-processor';
import {
    LoudnessProcessor,
    MAX_LOUDNESS,
    MIN_LOUDNESS,
    type LoudnessData,
} from '../models/nodes/filter/loudness-processor';
import {
    ModeProcessor,
    type ModeData,
} from '../models/nodes/filter/mode-processor';
import {
    ReleaseDateProcessor,
    type ReleaseDateData,
} from '../models/nodes/filter/release-date-processor';
import {
    MAX_SPEECHINESS,
    MIN_SPEECHINESS,
    SpeechinessProcessor,
    type SpeechinessData,
} from '../models/nodes/filter/speechiness-processor';
import {
    MAX_TEMPO,
    MIN_TEMPO,
    TempoProcessor,
    type TempoData,
} from '../models/nodes/filter/tempo-processor';
import {
    MAX_VALENCE,
    MIN_VALENCE,
    ValenceProcessor,
    type ValenceData,
} from '../models/nodes/filter/valence-processor';
import {
    type BaseNodeData,
    type NodeProcessor,
} from '../models/nodes/node-processor';
import { type CustomNodeType } from '../models/nodes/node-types';
import { DeduplicateProcessor } from '../models/nodes/processing/deduplicate-processor';
import { DifferenceProcessor } from '../models/nodes/processing/difference-processor';
import { IntersectionProcessor } from '../models/nodes/processing/intersection-processor';
import { RelativeComplementProcessor } from '../models/nodes/processing/relative-complement-processor';
import { ShuffleProcessor } from '../models/nodes/processing/shuffle-processor';
import {
    SortProcessor,
    type OrderByData,
} from '../models/nodes/processing/sort-processor';
import {
    AddToPlaylistProcessor,
    type AddToPlaylistData,
} from '../models/nodes/results/add-to-playlist-processor';
import { ResultNodeProcessor } from '../models/nodes/results/result-node-processor';
import {
    AlbumSourceProcessor,
    type AlbumData,
} from '../models/nodes/sources/album-source-processor';
import {
    ArtistTracksSourceProcessor,
    type ArtistData,
} from '../models/nodes/sources/artist-tracks-source-processor';
import {
    LikedSongsSourceProcessor,
    type LikedSongsData,
} from '../models/nodes/sources/liked-songs-source-processor';
import {
    LocalTracksSourceProcessor,
    type LocalTracksData,
} from '../models/nodes/sources/local-tracks-source-processor';
import {
    PlaylistSourceProcessor,
    type PlaylistData,
} from '../models/nodes/sources/playlist-tracks-source-processor';
import {
    RadioSourceProcessor,
    type RadioData,
} from '../models/nodes/sources/radio-source-processor';
import {
    TopTracksSourceProcessor,
    type TopTracksData,
} from '../models/nodes/sources/top-tracks-source-processor';

// Use undefined instead of null so that empty form values will not be persisted in storage.
export const nodeDefautValuesFactory: Record<
    CustomNodeType,
    () => Record<string, unknown>
> = {
    libraryPlaylistSource: () => {
        const data: PlaylistData = {
            playlistUri: '',
            offset: undefined,
            filter: undefined,
            limit: undefined,
            sortField: 'NO_SORT',
            sortOrder: 'ASC',
            isExecuting: undefined,
            onlyMine: false,
        };
        return data;
    },
    searchPlaylistSource: () => {
        const data: PlaylistData = {
            playlistUri: '',
            offset: undefined,
            filter: undefined,
            limit: undefined,
            sortField: 'NO_SORT',
            sortOrder: 'ASC',
            isExecuting: undefined,
            onlyMine: false,
        };
        return data;
    },
    acousticness: () => {
        const data: AcousticnessData = {
            range: {
                min: MIN_ACOUSTICNESS,
                max: MAX_ACOUSTICNESS,
            },
            isExecuting: undefined,
        };

        return data;
    },
    danceability: () => {
        const data: DanceabilityData = {
            range: {
                min: MIN_DANCEABILITY,
                max: MAX_DANCEABILITY,
            },
            isExecuting: undefined,
        };

        return data;
    },
    energy: () => {
        const data: EnergyData = {
            range: {
                min: MIN_ENERGY,
                max: MAX_ENERGY,
            },
            isExecuting: undefined,
        };

        return data;
    },
    instrumentalness: () => {
        const data: InstrumentalnessData = {
            range: {
                min: MIN_INSTRUMENTALNESS,
                max: MAX_INSTRUMENTALNESS,
            },
            isExecuting: undefined,
        };

        return data;
    },
    isPlayable: () => {
        const data: IsPlayableData = {
            isPlayable: true,
            isExecuting: undefined,
        };

        return data;
    },
    liveness: () => {
        const data: LivenessData = {
            range: {
                min: MIN_LIVENESS,
                max: MAX_LIVENESS,
            },
            isExecuting: undefined,
        };

        return data;
    },
    loudness: () => {
        const data: LoudnessData = {
            range: {
                min: MIN_LOUDNESS,
                max: MAX_LOUDNESS,
            },
            isExecuting: undefined,
        };

        return data;
    },
    speechiness: () => {
        const data: SpeechinessData = {
            range: {
                min: MIN_SPEECHINESS,
                max: MAX_SPEECHINESS,
            },
            isExecuting: undefined,
        };

        return data;
    },
    tempo: () => {
        const data: TempoData = {
            range: {
                min: MIN_TEMPO,
                max: MAX_TEMPO,
            },
            isExecuting: undefined,
        };

        return data;
    },
    valence: () => {
        const data: ValenceData = {
            range: {
                min: MIN_VALENCE,
                max: MAX_VALENCE,
            },
            isExecuting: undefined,
        };

        return data;
    },
    sort: () => {
        const data: OrderByData = {
            order: 'asc',
            property: 'name',
            isExecuting: undefined,
        };

        return data;
    },
    libraryAlbumSource: () => {
        const data: AlbumData = {
            uri: '',
            limit: undefined,
            offset: undefined,
            onlyLiked: false,
            isExecuting: undefined,
        };

        return data;
    },
    searchAlbumSource: () => {
        const data: AlbumData = {
            uri: '',
            limit: undefined,
            offset: undefined,
            onlyLiked: false,
            isExecuting: undefined,
        };

        return data;
    },
    likedSongsSource: () => {
        const data: LikedSongsData = {
            filter: undefined,
            offset: undefined,
            limit: undefined,
            sortField: 'ADDED_AT',
            sortOrder: 'DESC',
            genres: [],
            isExecuting: undefined,
        };

        return data;
    },
    localTracksSource: () => {
        const data: LocalTracksData = {
            filter: undefined,
            sortField: 'DURATION',
            sortOrder: 'DESC',
            isExecuting: undefined,
        };

        return data;
    },
    topTracksSource: () => {
        const data: TopTracksData = {
            timeRange: 'short_term',
            offset: undefined,
            limit: undefined,
            isExecuting: undefined,
        };

        return data;
    },
    mode: () => {
        const data: ModeData = {
            mode: '1',
            isExecuting: undefined,
        };
        return data;
    },
    shuffle: () => {
        return { isExecuting: undefined };
    },
    deduplicate: () => {
        return { isExecuting: undefined };
    },
    result: () => {
        return { isExecuting: undefined };
    },
    libraryArtistSource: () => {
        const data: ArtistData = {
            uri: '',
            isExecuting: undefined,
            trackType: 'liked',
        };
        return data;
    },
    searchArtistSource: () => {
        const data: ArtistData = {
            uri: '',
            isExecuting: undefined,
            trackType: 'liked',
        };
        return data;
    },
    radioAlbumSource: () => {
        const data: RadioData = {
            uri: '',
            sortField: 'NO_SORT',
            sortOrder: 'ASC',
            limit: undefined,
            offset: undefined,
            isExecuting: undefined,
        };

        return data;
    },
    radioArtistSource: () => {
        const data: RadioData = {
            uri: '',
            sortField: 'NO_SORT',
            sortOrder: 'ASC',
            limit: undefined,
            offset: undefined,
            isExecuting: undefined,
        };

        return data;
    },
    radioTrackSource: () => {
        const data: RadioData = {
            uri: '',
            sortField: 'NO_SORT',
            sortOrder: 'ASC',
            limit: undefined,
            offset: undefined,
            isExecuting: undefined,
        };

        return data;
    },
    releaseDate: () => {
        const data: ReleaseDateData = {
            minDate: undefined,
            maxDate: undefined,
            isExecuting: undefined,
        };

        return data;
    },
    duration: () => {
        const data: DurationData = {
            minDuration: undefined,
            maxDuration: undefined,
            isExecuting: undefined,
        };

        return data;
    },
    intersection: () => {
        return { isExecuting: undefined };
    },
    difference: () => {
        return { isExecuting: undefined };
    },
    relativeComplement: () => {
        return { isExecuting: undefined };
    },
    addToPlaylist: () => {
        const data: AddToPlaylistData = {
            playlistUri: '',
            operation: 'add',
            addDuplicateTracks: false,
            isExecuting: undefined,
        };
        return data;
    },
};

const getIncomingNodeIdsForHandle = (
    node: Node,
    handle: string,
    incomers: Node[],
    edges: Edge[],
) => {
    const incomingEdges = edges.filter(
        (edge) => edge.target === node.id && edge.targetHandle === handle,
    );

    const incomersForHandle = incomers.filter((n) =>
        incomingEdges.some((edge) => edge.source === n.id),
    );

    return incomersForHandle.map((n) => n.id);
};

export const nodeProcessorFactory: Record<
    CustomNodeType,
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
    result: (node: Node<BaseNodeData>, incomers) =>
        new ResultNodeProcessor(
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
    addToPlaylist: (node: Node<AddToPlaylistData>, incomers, _edges) =>
        new AddToPlaylistProcessor(
            node.id,
            { source: incomers.map((node) => node.id) },
            node.data,
        ),
};
