import { type ComponentType } from 'react';
import { type NodeProps } from 'reactflow';
import { LikedSongsSourceNode } from '../../components/nodes/sources/LikedSongs/LikedSongsSourceNode';
import { ResultNode } from '../../components/nodes/result/ResultNode';
import { LocalTracksSourceNode } from '../../components/nodes/sources/LocalTracks/LocalTracksSourceNode';
import { MergeNode } from '../../components/nodes/processing/MergeNode';
import { DeduplicateNode } from '../../components/nodes/processing/DeduplicateNode';
import { GenreNode } from '../../components/nodes/filter/GenreNode';

export type CustomNodeType =
    | 'likedSongsSource'
    | 'localTracksSource'
    | 'merge'
    | 'deduplicate'
    | 'genre'
    | 'result';

export const nodeTypes: Record<CustomNodeType, ComponentType<NodeProps>> = {
    likedSongsSource: LikedSongsSourceNode,
    localTracksSource: LocalTracksSourceNode,
    merge: MergeNode,
    deduplicate: DeduplicateNode,
    genre: GenreNode,
    result: ResultNode,
};
