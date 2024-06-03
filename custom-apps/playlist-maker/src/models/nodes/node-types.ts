import { type ComponentType } from 'react';
import { type NodeProps } from 'reactflow';
import { LikedSongsSourceNode } from '../../components/nodes/sources/LikedSongsSourceNode';
import { ResultNode } from '../../components/nodes/result/ResultNode';

export type CustomNodeType = 'likedSongsSource' | 'result';

export const nodeTypes: Record<CustomNodeType, ComponentType<NodeProps>> = {
    likedSongsSource: LikedSongsSourceNode,
    result: ResultNode,
};
