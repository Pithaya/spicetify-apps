import { type ComponentType } from 'react';
import { type NodeProps } from 'reactflow';
import { LikedSongsSourceNode } from '../../components/nodes/sources/LikedSongs/LikedSongsSourceNode';
import { ResultNode } from '../../components/nodes/result/ResultNode';
import { LocalTracksSourceNode } from '../../components/nodes/sources/LocalTracks/LocalTracksSourceNode';

export type CustomNodeType =
    | 'likedSongsSource'
    | 'localTracksSource'
    | 'result';

export const nodeTypes: Record<CustomNodeType, ComponentType<NodeProps>> = {
    likedSongsSource: LikedSongsSourceNode,
    localTracksSource: LocalTracksSourceNode,
    result: ResultNode,
};
