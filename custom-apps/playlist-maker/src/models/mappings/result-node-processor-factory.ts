import type { Edge, Node } from 'reactflow';
import type { ResultNodeType } from '../../types/node-types';
import type { BaseNodeData } from '../processors/base-node-processor';
import type { ResultNodeProcessor } from '../processors/result-node-processor';
import {
    type AddToPlaylistData,
    AddToPlaylistProcessor,
} from '../processors/results/add-to-playlist-processor';
import { AddToResultProcessor } from '../processors/results/add-to-result-processor';

/**
 * Constructs a result processor for the specified result node type.
 */
export const resultNodeProcessorFactory: Record<
    ResultNodeType,
    (
        node: Node,
        incomers: Node[],
        edges: Edge[],
    ) => ResultNodeProcessor<BaseNodeData>
> = {
    result: (node: Node<BaseNodeData>, incomers, _edges) =>
        new AddToResultProcessor(
            node.id,
            { source: incomers.map((node) => node.id) },
            node.data,
        ),
    addToPlaylist: (node: Node<AddToPlaylistData>, incomers, _edges) =>
        new AddToPlaylistProcessor(
            node.id,
            { source: incomers.map((node) => node.id) },
            node.data,
        ),
};
