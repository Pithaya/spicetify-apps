import { type Edge, getIncomers, type Node } from 'reactflow';
import {
    type AcousticnessData,
    AcousticnessProcessor,
    MAX_ACOUSTICNESS,
    MIN_ACOUSTICNESS,
} from '../models/nodes/filter/acousticness-processor';
import {
    type DanceabilityData,
    DanceabilityProcessor,
    MAX_DANCEABILITY,
    MIN_DANCEABILITY,
} from '../models/nodes/filter/danceability-processor';
import {
    type EnergyData,
    EnergyProcessor,
    MAX_ENERGY,
    MIN_ENERGY,
} from '../models/nodes/filter/energy-processor';
import {
    type InstrumentalnessData,
    InstrumentalnessProcessor,
    MAX_INSTRUMENTALNESS,
    MIN_INSTRUMENTALNESS,
} from '../models/nodes/filter/instrumentalness-processor';
import {
    type IsPlayableData,
    IsPlayableProcessor,
} from '../models/nodes/filter/is-playable-processor';
import {
    type LivenessData,
    LivenessProcessor,
    MAX_LIVENESS,
    MIN_LIVENESS,
} from '../models/nodes/filter/liveness-processor';
import {
    type LoudnessData,
    LoudnessProcessor,
    MAX_LOUDNESS,
    MIN_LOUDNESS,
} from '../models/nodes/filter/loudness-processor';
import {
    type ModeData,
    ModeProcessor,
} from '../models/nodes/filter/mode-processor';
import {
    type ReleaseDateData,
    ReleaseDateProcessor,
} from '../models/nodes/filter/release-date-processor';
import {
    MAX_SPEECHINESS,
    MIN_SPEECHINESS,
    type SpeechinessData,
    SpeechinessProcessor,
} from '../models/nodes/filter/speechiness-processor';
import {
    MAX_TEMPO,
    MIN_TEMPO,
    type TempoData,
    TempoProcessor,
} from '../models/nodes/filter/tempo-processor';
import {
    MAX_VALENCE,
    MIN_VALENCE,
    type ValenceData,
    ValenceProcessor,
} from '../models/nodes/filter/valence-processor';
import {
    type BaseNodeData,
    type NodeProcessor,
} from '../models/nodes/node-processor';
import { type CustomNodeType } from '../models/nodes/node-types';
import { DeduplicateProcessor } from '../models/nodes/processing/deduplicate-processor';
import { ShuffleProcessor } from '../models/nodes/processing/shuffle-processor';
import {
    type OrderByData,
    SortProcessor,
} from '../models/nodes/processing/sort-processor';
import { ResultNodeProcessor } from '../models/nodes/results/result-node-processor';
import {
    type AlbumData,
    AlbumSourceProcessor,
} from '../models/nodes/sources/album-source-processor';
import {
    type ArtistData,
    ArtistTracksSourceProcessor,
} from '../models/nodes/sources/artist-tracks-source-processor';
import {
    type LikedSongsData,
    LikedSongsSourceProcessor,
} from '../models/nodes/sources/liked-songs-source-processor';
import {
    type LocalTracksData,
    LocalTracksSourceProcessor,
} from '../models/nodes/sources/local-tracks-source-processor';
import {
    type PlaylistData,
    PlaylistSourceProcessor,
} from '../models/nodes/sources/playlist-tracks-source-processor';
import {
    type RadioData,
    RadioSourceProcessor,
} from '../models/nodes/sources/radio-source-processor';
import {
    type TopTracksData,
    TopTracksSourceProcessor,
} from '../models/nodes/sources/top-tracks-source-processor';
import useAppStore from '../stores/store';

// Use undefined instead of null so that empty form values will not be persisted in storage.
const nodeDefautValuesFactory: Record<
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
};

export const getDefaultValueForNodeType = (
    type: CustomNodeType,
): BaseNodeData => {
    return nodeDefautValuesFactory[type]();
};

const nodeProcessorFactory: Record<
    CustomNodeType,
    (node: Node, incomers: Node[]) => NodeProcessor<BaseNodeData>
> = {
    likedSongsSource: (node: Node<LikedSongsData>, _incomers) =>
        new LikedSongsSourceProcessor(node.id, [], node.data),
    localTracksSource: (node: Node<LocalTracksData>, _incomers) =>
        new LocalTracksSourceProcessor(node.id, [], node.data),
    libraryPlaylistSource: (node: Node<PlaylistData>, _incomers) =>
        new PlaylistSourceProcessor(node.id, [], node.data),
    searchPlaylistSource: (node: Node<PlaylistData>, _incomers) =>
        new PlaylistSourceProcessor(node.id, [], node.data),
    topTracksSource: (node: Node<TopTracksData>, _incomers) =>
        new TopTracksSourceProcessor(node.id, [], node.data),
    libraryAlbumSource: (node: Node<AlbumData>, _incomers) =>
        new AlbumSourceProcessor(node.id, [], node.data),
    searchAlbumSource: (node: Node<AlbumData>, _incomers) =>
        new AlbumSourceProcessor(node.id, [], node.data),
    libraryArtistSource: (node: Node<ArtistData>, _incomers) =>
        new ArtistTracksSourceProcessor(node.id, [], node.data),
    searchArtistSource: (node: Node<ArtistData>, _incomers) =>
        new ArtistTracksSourceProcessor(node.id, [], node.data),
    deduplicate: (node: Node<BaseNodeData>, incomers) =>
        new DeduplicateProcessor(
            node.id,
            incomers.map((node) => node.id),
            node.data,
        ),
    isPlayable: (node: Node<IsPlayableData>, incomers) =>
        new IsPlayableProcessor(
            node.id,
            incomers.map((node) => node.id),
            node.data,
        ),
    acousticness: (node: Node<AcousticnessData>, incomers) =>
        new AcousticnessProcessor(
            node.id,
            incomers.map((node) => node.id),
            node.data,
        ),
    shuffle: (node: Node<BaseNodeData>, incomers) =>
        new ShuffleProcessor(
            node.id,
            incomers.map((node) => node.id),
            node.data,
        ),
    result: (node: Node<BaseNodeData>, incomers) =>
        new ResultNodeProcessor(
            node.id,
            incomers.map((node) => node.id),
            node.data,
        ),
    sort: (node: Node<OrderByData>, incomers) =>
        new SortProcessor(
            node.id,
            incomers.map((node) => node.id),
            node.data,
        ),
    danceability: (node: Node<DanceabilityData>, incomers) =>
        new DanceabilityProcessor(
            node.id,
            incomers.map((node) => node.id),
            node.data,
        ),
    energy: (node: Node<EnergyData>, incomers) =>
        new EnergyProcessor(
            node.id,
            incomers.map((node) => node.id),
            node.data,
        ),
    instrumentalness: (node: Node<InstrumentalnessData>, incomers) =>
        new InstrumentalnessProcessor(
            node.id,
            incomers.map((node) => node.id),
            node.data,
        ),
    liveness: (node: Node<LivenessData>, incomers) =>
        new LivenessProcessor(
            node.id,
            incomers.map((node) => node.id),
            node.data,
        ),
    loudness: (node: Node<LoudnessData>, incomers) =>
        new LoudnessProcessor(
            node.id,
            incomers.map((node) => node.id),
            node.data,
        ),
    speechiness: (node: Node<SpeechinessData>, incomers) =>
        new SpeechinessProcessor(
            node.id,
            incomers.map((node) => node.id),
            node.data,
        ),
    valence: (node: Node<ValenceData>, incomers) =>
        new ValenceProcessor(
            node.id,
            incomers.map((node) => node.id),
            node.data,
        ),
    tempo: (node: Node<TempoData>, incomers) =>
        new TempoProcessor(
            node.id,
            incomers.map((node) => node.id),
            node.data,
        ),
    mode: (node: Node<ModeData>, incomers) =>
        new ModeProcessor(
            node.id,
            incomers.map((node) => node.id),
            node.data,
        ),
    radioAlbumSource: (node: Node<RadioData>, _incomers) =>
        new RadioSourceProcessor(node.id, [], node.data),
    radioArtistSource: (node: Node<RadioData>, _incomers) =>
        new RadioSourceProcessor(node.id, [], node.data),
    radioTrackSource: (node: Node<RadioData>, _incomers) =>
        new RadioSourceProcessor(node.id, [], node.data),
    releaseDate: (node: Node<ReleaseDateData>, incomers) =>
        new ReleaseDateProcessor(
            node.id,
            incomers.map((node) => node.id),
            node.data,
        ),
};

export async function executeWorkflow(
    nodes: Node[],
    edges: Edge[],
): Promise<void> {
    const setResult = useAppStore.getState().setResult;
    const updateNodeData = useAppStore.getState().updateNodeData;
    const validationCallbacks =
        useAppStore.getState().nodeFormValidationCallbacks;

    const resultNodes = nodes.filter(
        (node) => (node.type as CustomNodeType) === 'result',
    );

    if (resultNodes.length === 0) {
        Spicetify.showNotification('No result node found in workflow', true);
        return;
    }

    if (resultNodes.length > 1) {
        Spicetify.showNotification(
            'The workflow should have only one result node',
            true,
        );
        return;
    }

    const resultNode = resultNodes[0];

    // Validate node data
    let valid = true;
    for (const callback of validationCallbacks.values()) {
        const validationResult = await callback();
        valid = valid && validationResult;
    }

    if (!valid) {
        Spicetify.showNotification('Some nodes are invalid', true);
        return;
    }

    // Build the graph starting from the result node
    const nodesToVisit: Node[] = getIncomers(resultNode, nodes, edges);
    const resultProcessor = nodeProcessorFactory.result(
        resultNode,
        nodesToVisit,
    );
    const allProcessors: Record<string, NodeProcessor<BaseNodeData>> = {
        [resultNode.id]: resultProcessor,
    };
    const visitedNodes: Set<string> = new Set<string>([resultNode.id]);

    while (nodesToVisit.length > 0) {
        const currentNode = nodesToVisit.pop()!;

        if (visitedNodes.has(currentNode.id)) {
            // Skip already visited nodes
            continue;
        }

        visitedNodes.add(currentNode.id);

        const incomers = getIncomers(currentNode, nodes, edges);
        const nodeType: CustomNodeType | undefined =
            currentNode.type as CustomNodeType;

        allProcessors[currentNode.id] = nodeProcessorFactory[nodeType](
            currentNode,
            incomers,
        );

        nodesToVisit.push(...incomers);
    }

    try {
        const finalResult = await resultProcessor.getResults(allProcessors);

        setResult(finalResult);
        Spicetify.showNotification(
            'Workflow executed successfully',
            false,
            1000,
        );
    } catch (e) {
        console.error('Error while executing workflow:', e);
        Spicetify.showNotification('Error while executing workflow', true);

        setResult([]);
        for (const node of nodes) {
            updateNodeData(node.id, { isExecuting: false });
        }
    }
}
