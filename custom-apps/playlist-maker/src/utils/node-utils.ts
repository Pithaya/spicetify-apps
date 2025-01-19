import useAppStore from '../stores/store';
import { type Edge, getIncomers, type Node } from 'reactflow';
import { type CustomNodeType } from '../models/nodes/node-types';
import { ResultNodeProcessor } from '../models/nodes/results/result-node-processor';
import { type NodeProcessor } from '../models/nodes/node-processor';
import { LikedSongsSourceProcessor } from '../models/nodes/sources/liked-songs-source-processor';
import { LocalTracksSourceProcessor } from '../models/nodes/sources/local-tracks-source-processor';
import { DeduplicateProcessor } from '../models/nodes/processing/deduplicate-processor';
import { GenreProcessor } from '../models/nodes/filter/genre-processor';
import { PlaylistSourceProcessor } from '../models/nodes/sources/my-playlists-source-processor';
import { ShuffleProcessor } from '../models/nodes/processing/shuffle-processor';
import { TopTracksSourceProcessor } from '../models/nodes/sources/top-tracks-source-processor';
import { IsPlayableProcessor } from '../models/nodes/filter/is-playable-processor';
import { SortProcessor } from '../models/nodes/processing/sort-processor';
import { AcousticnessProcessor } from '../models/nodes/filter/acousticness-processor';
import { DanceabilityProcessor } from '../models/nodes/filter/danceability-processor';
import { EnergyProcessor } from '../models/nodes/filter/energy-processor';
import { InstrumentalnessProcessor } from '../models/nodes/filter/instrumentalness-processor';
import { LivenessProcessor } from '../models/nodes/filter/liveness-processor';
import { LoudnessProcessor } from '../models/nodes/filter/loudness-processor';
import { SpeechinessProcessor } from '../models/nodes/filter/speechiness-processor';
import { ValenceProcessor } from '../models/nodes/filter/valence-processor';
import { TempoProcessor } from '../models/nodes/filter/tempo-processor';
import { ModeProcessor } from '../models/nodes/filter/mode-processor';

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
