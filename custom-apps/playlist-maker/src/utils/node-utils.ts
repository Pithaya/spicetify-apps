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
    type GenreFilterData,
    GenreProcessor,
} from '../models/nodes/filter/genre-processor';
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
import { type NodeProcessor } from '../models/nodes/node-processor';
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
} from '../models/nodes/sources/my-playlists-source-processor';
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
    genre: () => {
        const data: GenreFilterData = {
            genreCategories: [],
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
    likedSongsSource: () => {
        const data: LikedSongsData = {
            filter: undefined,
            offset: undefined,
            limit: undefined,
            sortField: 'ADDED_AT',
            sortOrder: 'DESC',
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
};

export const getDefaultValueForNodeType = (type: CustomNodeType): any => {
    return nodeDefautValuesFactory[type]();
};

const nodeProcessorFactory: Record<
    CustomNodeType,
    (node: Node, incomers: Node[]) => NodeProcessor<any>
> = {
    likedSongsSource: (node, incomers) =>
        new LikedSongsSourceProcessor(node.id, [], node.data),
    localTracksSource: (node, incomers) =>
        new LocalTracksSourceProcessor(node.id, [], node.data),
    libraryPlaylistSource: (node, incomers) =>
        new PlaylistSourceProcessor(node.id, [], node.data),
    topTracksSource: (node, incomers) =>
        new TopTracksSourceProcessor(node.id, [], node.data),
    libraryAlbumSource: (node, incomers) =>
        new AlbumSourceProcessor(node.id, [], node.data),
    deduplicate: (node, incomers) =>
        new DeduplicateProcessor(
            node.id,
            incomers.map((node) => node.id),
            node.data,
        ),
    genre: (node, incomers) =>
        new GenreProcessor(
            node.id,
            incomers.map((node) => node.id),
            node.data,
        ),
    isPlayable: (node, incomers) =>
        new IsPlayableProcessor(
            node.id,
            incomers.map((node) => node.id),
            node.data,
        ),
    acousticness: (node, incomers) =>
        new AcousticnessProcessor(
            node.id,
            incomers.map((node) => node.id),
            node.data,
        ),
    shuffle: (node, incomers) =>
        new ShuffleProcessor(
            node.id,
            incomers.map((node) => node.id),
            node.data,
        ),
    result: (node, incomers) =>
        new ResultNodeProcessor(
            node.id,
            incomers.map((node) => node.id),
            node.data,
        ),
    sort: (node, incomers) =>
        new SortProcessor(
            node.id,
            incomers.map((node) => node.id),
            node.data,
        ),
    danceability: (node, incomers) =>
        new DanceabilityProcessor(
            node.id,
            incomers.map((node) => node.id),
            node.data,
        ),
    energy: (node, incomers) =>
        new EnergyProcessor(
            node.id,
            incomers.map((node) => node.id),
            node.data,
        ),
    instrumentalness: (node, incomers) =>
        new InstrumentalnessProcessor(
            node.id,
            incomers.map((node) => node.id),
            node.data,
        ),
    liveness: (node, incomers) =>
        new LivenessProcessor(
            node.id,
            incomers.map((node) => node.id),
            node.data,
        ),
    loudness: (node, incomers) =>
        new LoudnessProcessor(
            node.id,
            incomers.map((node) => node.id),
            node.data,
        ),
    speechiness: (node, incomers) =>
        new SpeechinessProcessor(
            node.id,
            incomers.map((node) => node.id),
            node.data,
        ),
    valence: (node, incomers) =>
        new ValenceProcessor(
            node.id,
            incomers.map((node) => node.id),
            node.data,
        ),
    tempo: (node, incomers) =>
        new TempoProcessor(
            node.id,
            incomers.map((node) => node.id),
            node.data,
        ),
    mode: (node, incomers) =>
        new ModeProcessor(
            node.id,
            incomers.map((node) => node.id),
            node.data,
        ),
};

export async function executeWorkflow(
    nodes: Node[],
    edges: Edge[],
): Promise<void> {
    console.log('Executing workflow with nodes:', nodes);
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
    const allProcessors: Record<string, NodeProcessor<any>> = {
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

        if (nodeProcessorFactory[nodeType] === undefined) {
            throw new Error(`Unknown node type: ${nodeType}`);
        }

        allProcessors[currentNode.id] = nodeProcessorFactory[nodeType](
            currentNode,
            incomers,
        );

        nodesToVisit.push(...incomers);
    }

    console.log('All processors : ', allProcessors);
    try {
        const finalResult = await resultProcessor.getResults(allProcessors);
        console.log('Final result : ', finalResult);

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
